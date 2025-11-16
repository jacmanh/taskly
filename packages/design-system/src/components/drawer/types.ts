import * as React from 'react';

/**
 * Configuration for a single drawer instance
 */
export interface DrawerConfig {
  /** Unique identifier for this drawer instance */
  id?: string;
  /** Drawer title */
  title?: React.ReactNode;
  /** Optional description below the title */
  description?: React.ReactNode;
  /** Content to render in the drawer body */
  children?: React.ReactNode;
  /** Custom footer slot */
  footer?: React.ReactNode;
  /** Optional callback called BEFORE drawer closes (cleanup, form reset, etc.) */
  onBeforeClose?: () => void | Promise<void>;
  /** Optional callback called AFTER drawer is closed */
  onClose?: () => void;
  /** Custom class names for styling */
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

/**
 * Internal drawer state with metadata
 */
export interface DrawerState extends DrawerConfig {
  /** Unique identifier (auto-generated if not provided) */
  id: string;
  /** Whether this drawer is currently open */
  isOpen: boolean;
  /** Z-index for stacking (auto-calculated) */
  zIndex: number;
}

/**
 * Context API for drawer management
 */
export interface DrawerContextType {
  /** Array of all drawer states (stack) */
  drawers: DrawerState[];
  /** Open a new drawer (returns drawer ID) */
  openDrawer: (config: DrawerConfig) => string;
  /** Close a specific drawer by ID (closes top drawer if no ID provided) */
  closeDrawer: (id?: string) => Promise<void>;
  /** Close all drawers */
  closeAllDrawers: () => Promise<void>;
  /** Check if any drawer is currently open */
  hasOpenDrawer: boolean;
}
