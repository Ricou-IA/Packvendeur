import { Navigate } from 'react-router-dom';
import ProHeader from './ProHeader';
import { useProAccount, useProLogout } from '@hooks/useProAccount';

export default function ProLayout({ children }) {
  const { proAccount, isLoading, isRegistered } = useProAccount();
  const logout = useProLogout();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-secondary-400">Chargement...</div>
      </div>
    );
  }

  if (!isRegistered) {
    return <Navigate to="/pro/register" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <ProHeader proAccount={proAccount} onLogout={logout} />
      <main className="flex-1">
        {typeof children === 'function' ? children({ proAccount }) : children}
      </main>
    </div>
  );
}
