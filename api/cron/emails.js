/**
 * Vercel Cron proxy → invokes Supabase Edge Function pv-email-cron.
 * Scheduled daily at 8:00 UTC via vercel.json crons config.
 */
export default async function handler(req, res) {
  // Verify cron secret (Vercel adds Authorization header for cron invocations)
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/pv-email-cron`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'x-cron-secret': process.env.CRON_SECRET,
        },
        body: JSON.stringify({ trigger: 'vercel-cron' }),
      }
    );

    const data = await response.json();
    console.log('[cron/emails] Result:', JSON.stringify(data));
    return res.status(200).json(data);
  } catch (error) {
    console.error('[cron/emails] Error:', error);
    return res.status(500).json({ error: 'Cron execution failed' });
  }
}
