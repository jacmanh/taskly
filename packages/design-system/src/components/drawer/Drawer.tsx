'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetClose,
} from '../../lib/shadcn/sheet';
import { X } from 'lucide-react';

interface DrawerSectionsContextValue {
  setHeader: (content: React.ReactNode | null) => void;
  setFooter: (
    section: { content: React.ReactNode; className?: string } | null
  ) => void;
}

const DrawerSectionsContext =
  React.createContext<DrawerSectionsContextValue | null>(null);

export interface DrawerHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

export interface DrawerFooterProps {
  children?: React.ReactNode;
  className?: string;
}

export interface DrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

const DrawerHeaderComponent: React.FC<DrawerHeaderProps> = ({
  title,
  description,
  children,
}) => {
  const context = React.useContext(DrawerSectionsContext);

  if (!context) {
    return null;
  }

  const headerContent = React.useMemo(() => {
    if (children) return children;

    return (
      <>
        {title && (
          <SheetTitle className="text-lg font-semibold text-secondary-900">
            {title}
          </SheetTitle>
        )}
        {description && (
          <p className="mt-1 text-sm text-secondary-500">{description}</p>
        )}
      </>
    );
  }, [children, title, description]);

  React.useLayoutEffect(() => {
    context.setHeader(headerContent);
    return () => context.setHeader(null);
  }, [context, headerContent]);

  return null;
};
DrawerHeaderComponent.displayName = 'Drawer.Header';

const DrawerFooterComponent: React.FC<DrawerFooterProps> = ({
  children,
  className,
}) => {
  const context = React.useContext(DrawerSectionsContext);

  if (!context) {
    return null;
  }

  React.useLayoutEffect(() => {
    context.setFooter({ content: children, className });
    return () => context.setFooter(null);
  }, [context, children, className]);

  return null;
};
DrawerFooterComponent.displayName = 'Drawer.Footer';

const DrawerRoot = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onOpenChange,
      title,
      description,
      children,
      footer,
      className,
      headerClassName,
      contentClassName,
      footerClassName,
    },
    ref
  ) => {
    const [headerContent, setHeaderContent] = React.useState<React.ReactNode>(
      null
    );
    const [footerSection, setFooterSection] = React.useState<{
      content: React.ReactNode;
      className?: string;
    } | null>(null);

    const sectionsContext = React.useMemo(
      () => ({
        setHeader: setHeaderContent,
        setFooter: setFooterSection,
      }),
      []
    );

    const defaultHeader =
      title || description ? (
        <>
          {title && (
            <SheetTitle className="text-lg font-semibold text-secondary-900">
              {title}
            </SheetTitle>
          )}
          {description && (
            <p className="mt-1 text-sm text-secondary-500">{description}</p>
          )}
        </>
      ) : null;

    const resolvedHeaderContent =
      headerContent ??
      defaultHeader ??
      ((
        <SheetTitle className="sr-only">Drawer panel</SheetTitle>
      ) as React.ReactNode);

    const resolvedFooterContent =
      footerSection?.content ?? footer;

    const shouldRenderFooter = Boolean(footerSection || footer);

    return (
      <DrawerSectionsContext.Provider value={sectionsContext}>
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent
            ref={ref}
            side="right"
            className={cn(
              'w-[420px] flex flex-col overflow-hidden bg-white p-0',
              'sm:w-[420px] md:w-[420px]',
              // Mobile: full screen
              'fixed inset-y-0 right-0 max-w-full',
              className
            )}
          >
            {/* Header */}
            <SheetHeader
              className={cn(
                'border-b border-secondary-200 px-6 py-4 flex-shrink-0 relative',
                headerClassName
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">{resolvedHeaderContent}</div>
                <SheetClose className="absolute top-4 right-4 h-6 w-6 rounded-md opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary-100 flex-shrink-0">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </div>
            </SheetHeader>

            {/* Content - Scrollable */}
            <div
              className={cn(
                'flex-1 overflow-y-auto px-6 py-4',
                contentClassName
              )}
            >
              {children}
            </div>

            {/* Footer - Sticky */}
            {shouldRenderFooter && (
              <SheetFooter
                className={cn(
                  'border-t border-secondary-200 bg-secondary-50 px-6 py-4 flex-shrink-0 gap-3 sm:flex-row',
                  footerClassName,
                  footerSection?.className
                )}
              >
                {resolvedFooterContent}
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>
      </DrawerSectionsContext.Provider>
    );
  }
);

DrawerRoot.displayName = 'Drawer';

type DrawerComponent = typeof DrawerRoot & {
  Header: React.FC<DrawerHeaderProps>;
  Footer: React.FC<DrawerFooterProps>;
};

export const Drawer = Object.assign(DrawerRoot, {
  Header: DrawerHeaderComponent,
  Footer: DrawerFooterComponent,
}) as DrawerComponent;
