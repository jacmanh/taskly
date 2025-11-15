'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@features/auth/hooks/useAuth';
import { useLogout } from '@features/auth/hooks/useAuthMutations';

export function Navbar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // Don't show navbar on public routes
  const publicRoutes = ['/', '/login', '/register'];
  if (publicRoutes.includes(pathname) || isLoading || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-900">Taskly</h1>
            <div className="flex gap-6">
              <a
                href="/dashboard"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/dashboard'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </a>
              <a
                href="/workspaces"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/workspaces'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Workspaces
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              {user.name || user.email}
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? 'Déconnexion...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
