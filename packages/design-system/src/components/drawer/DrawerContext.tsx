'use client';

import * as React from 'react';
import type { DrawerConfig, DrawerContextType, DrawerState } from './types';

// Animation duration for drawer close transition (ms)
const DRAWER_CLOSE_ANIMATION_DURATION = 400;

// Base z-index for the first drawer
const BASE_Z_INDEX = 1000;

export const DrawerContext = React.createContext<DrawerContextType | undefined>(
  undefined
);

export function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within DrawerProvider');
  }
  return context;
}

/**
 * Generate a unique ID for drawer instances
 */
function generateDrawerId(): string {
  return `drawer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [drawers, setDrawers] = React.useState<DrawerState[]>([]);
  const isMountedRef = React.useRef(true);
  const timeoutsRef = React.useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Clear all pending timeouts
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  const openDrawer = React.useCallback((config: DrawerConfig): string => {
    const id = config.id || generateDrawerId();

    setDrawers((prev) => {
      // Calculate z-index based on position in stack
      const zIndex = BASE_Z_INDEX + prev.length;

      const newDrawer: DrawerState = {
        ...config,
        id,
        isOpen: true,
        zIndex,
      };

      return [...prev, newDrawer];
    });

    return id;
  }, []);

  const closeDrawer = React.useCallback(
    (idOrEvent?: string | React.SyntheticEvent | Event | boolean) => {
      const targetId =
        typeof idOrEvent === 'string' ? idOrEvent : undefined;

      const performClose = async () => {
        // Use a ref to get the current drawer to close
        let drawerToClose: DrawerState | undefined;

        setDrawers((prev) => {
          // Find the drawer to close from current state
          drawerToClose = targetId
            ? prev.find((d) => d.id === targetId)
            : prev[prev.length - 1];

          if (!drawerToClose) return prev;

          // Clear any existing timeout for this drawer
          const existingTimeout = timeoutsRef.current.get(drawerToClose.id);
          if (existingTimeout) {
            clearTimeout(existingTimeout);
          }

          return prev; // Don't update state yet, we need to call onBeforeClose first
        });

        if (!drawerToClose) return;

        // Store the drawer info we need before it might become undefined
        const drawerIdToClose = drawerToClose.id;
        const onBeforeClose = drawerToClose.onBeforeClose;
        const onClose = drawerToClose.onClose;

        // Call onBeforeClose BEFORE marking as closed (component still mounted)
        if (onBeforeClose) {
          try {
            await onBeforeClose();
          } catch (error) {
            console.error('Error in onBeforeClose:', error);
          }
        }

        // Now update the state to mark drawer as closing
        setDrawers((prev) => {
          // Mark drawer as closing (isOpen = false)
          const updatedDrawers = prev.map((d) =>
            d.id === drawerIdToClose ? { ...d, isOpen: false } : d
          );

          // Schedule removal after animation completes
          const timeout = setTimeout(() => {
            if (isMountedRef.current) {
              setDrawers((current) =>
                current.filter((d) => d.id !== drawerIdToClose)
              );
              timeoutsRef.current.delete(drawerIdToClose);

              // Call onClose AFTER drawer is fully removed
              if (onClose) {
                onClose();
              }
            }
          }, DRAWER_CLOSE_ANIMATION_DURATION);

          timeoutsRef.current.set(drawerIdToClose, timeout);

          return updatedDrawers;
        });
      };

      void performClose();
    },
    []
  );

  const closeAllDrawers = React.useCallback(async () => {
    let drawersToClose: DrawerState[] = [];

    setDrawers((prev) => {
      drawersToClose = prev;
      return prev; // Don't update state yet
    });

    // Call onBeforeClose for all drawers while they're still mounted
    await Promise.all(
      drawersToClose.map(async (drawer) => {
        if (drawer.onBeforeClose) {
          try {
            await drawer.onBeforeClose();
          } catch (error) {
            console.error('Error in onBeforeClose:', error);
          }
        }
      })
    );

    setDrawers((prev) => {
      // Clear all timeouts
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();

      // Mark all as closing
      const closingDrawers = prev.map((d) => ({ ...d, isOpen: false }));

      // Schedule removal
      const timeout = setTimeout(() => {
        if (isMountedRef.current) {
          setDrawers([]);

          // Call onClose for all drawers AFTER removal
          prev.forEach((drawer) => {
            if (drawer.onClose) {
              drawer.onClose();
            }
          });
        }
      }, DRAWER_CLOSE_ANIMATION_DURATION);

      timeoutsRef.current.set('all', timeout);

      return closingDrawers;
    });
  }, []);

  const hasOpenDrawer = React.useMemo(
    () => drawers.some((d) => d.isOpen),
    [drawers]
  );

  const value = React.useMemo<DrawerContextType>(
    () => ({
      drawers,
      openDrawer,
      closeDrawer,
      closeAllDrawers,
      hasOpenDrawer,
    }),
    [drawers, openDrawer, closeDrawer, closeAllDrawers, hasOpenDrawer]
  );

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
}
