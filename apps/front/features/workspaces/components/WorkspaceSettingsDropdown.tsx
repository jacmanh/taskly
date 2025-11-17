'use client';

import { useState, useEffect } from 'react';
import { Settings, Users, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@taskly/design-system';
import { useLogout } from '@features/auth/hooks/useAuthMutations';

export function WorkspaceSettingsDropdown() {
  const [mounted, setMounted] = useState(false);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (!mounted) {
    return (
      <div className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700">
        <Settings size={18} />
        <span>Settings</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500">
        <Settings size={18} />
        <span>Settings</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <Settings size={16} />
          <span>Workspace settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <Users size={16} />
          <span>Members</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 text-error-600 cursor-pointer"
        >
          <LogOut size={16} />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
