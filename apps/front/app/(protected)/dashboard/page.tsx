'use client';

import { useAuth } from '@features/auth/hooks/useAuth';
import { useCurrentWorkspace } from '@features/workspaces/hooks/useCurrentWorkspace';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { currentWorkspace, isLoading: workspaceLoading } =
    useCurrentWorkspace();

  if (authLoading || workspaceLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-neutral-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Middleware will redirect
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          {currentWorkspace && (
            <p className="mt-1 text-sm text-neutral-500">
              Workspace: {currentWorkspace.icon} {currentWorkspace.name}
            </p>
          )}
        </div>

        <div className="bg-neutral-50 shadow overflow-hidden rounded-lg border border-neutral-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-neutral-900">
              Welcome to your dashboard
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-neutral-500">
              You are successfully authenticated!
            </p>
          </div>
          <div className="border-t border-neutral-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-neutral-500">Email</dt>
                <dd className="mt-1 text-sm text-neutral-900">{user.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-neutral-500">Name</dt>
                <dd className="mt-1 text-sm text-neutral-900">
                  {user.name || 'Not provided'}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-neutral-500">
                  User ID
                </dt>
                <dd className="mt-1 text-sm text-neutral-900">{user.id}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-neutral-500">
                  Email Verified
                </dt>
                <dd className="mt-1 text-sm text-neutral-900">
                  {user.emailVerified ? 'Yes' : 'No'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
