'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Drawer } from './Drawer';
import { useDrawer } from './DrawerContext';
import { DrawerErrorBoundary } from './DrawerErrorBoundary';

/**
 * Drawer Portal Container
 * Renders all active drawers via portals to the document body
 * Supports multiple drawers with proper z-index stacking
 * This component should be placed anywhere inside a DrawerProvider
 */
export function DrawerContainer() {
  const { drawers, closeDrawer } = useDrawer();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Render all drawers in the stack
  const drawerElements = (
    <>
      {drawers.map((drawer) => (
        <div key={drawer.id} style={{ zIndex: drawer.zIndex }}>
          <DrawerErrorBoundary
            onError={() => closeDrawer(drawer.id)}
            drawerId={drawer.id}
          >
            <Drawer
              isOpen={drawer.isOpen}
              onOpenChange={(open) => {
                if (!open) {
                  // Prevent Radix UI from closing immediately
                  // Our closeDrawer will handle the animation
                  void closeDrawer(drawer.id);
                }
              }}
              title={drawer.title}
              description={drawer.description}
              footer={drawer.footer}
              className={drawer.className}
              headerClassName={drawer.headerClassName}
              contentClassName={drawer.contentClassName}
              footerClassName={drawer.footerClassName}
            >
              {drawer.children}
            </Drawer>
          </DrawerErrorBoundary>
        </div>
      ))}
    </>
  );

  return createPortal(drawerElements, document.body);
}
