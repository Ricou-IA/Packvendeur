export const GEMINI_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";
export const GEMINI_FILES_BASE =
  "https://generativelanguage.googleapis.com/upload/v1beta/files";

/**
 * Upload a PDF to Gemini File API using resumable upload protocol (2-step).
 * Returns the file URI for use in generateContent calls.
 */
export async function uploadToGeminiFileApi(
  apiKey: string,
  base64: string,
  displayName: string,
): Promise<string> {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Step 1: Initiate resumable upload
  const startRes = await fetch(`${GEMINI_FILES_BASE}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Length": String(bytes.length),
      "X-Goog-Upload-Header-Content-Type": "application/pdf",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file: { displayName } }),
  });

  if (!startRes.ok) {
    const errorText = await startRes.text();
    throw new Error(
      `Gemini File API start failed (${startRes.status}): ${errorText}`,
    );
  }

  const uploadUrl = startRes.headers.get("X-Goog-Upload-URL");
  if (!uploadUrl) {
    throw new Error("No upload URL returned by Gemini File API");
  }

  // Step 2: Upload the raw bytes
  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Length": String(bytes.length),
      "X-Goog-Upload-Offset": "0",
      "X-Goog-Upload-Command": "upload, finalize",
    },
    body: bytes,
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(
      `Gemini File API upload failed (${uploadRes.status}): ${errorText}`,
    );
  }

  const result = await uploadRes.json();
  const uri = result.file?.uri;
  if (!uri) throw new Error("No file URI in upload response");
  return uri;
}

/**
 * Call Gemini with retry on 429 rate limits.
 * Returns parsed JSON from the model response.
 */
export async function callGemini(
  apiKey: string,
  model: string,
  parts: unknown[],
): Promise<unknown> {
  const url = `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`;
  const MAX_RETRIES = 2;
  const RETRY_DELAYS = [2000, 5000];

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      }),
    });

    if (response.status === 429 && attempt < MAX_RETRIES) {
      const delay = RETRY_DELAYS[attempt];
      console.warn(
        `[callGemini] 429 rate limit on ${model}, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
      );
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Gemini API error (${response.status}): ${errorText}`,
      );
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text in Gemini response");
    }

    return JSON.parse(text);
  }

  throw new Error(
    `Gemini API: max retries (${MAX_RETRIES}) exceeded for ${model}`,
  );
}
