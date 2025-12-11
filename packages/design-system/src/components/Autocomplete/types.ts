import { ReactNode } from 'react';

/**
 * Base option type with generic value support
 */
export interface AutocompleteOption<TValue = string> {
  value: TValue;
  label: string;
  disabled?: boolean;
  description?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Group type for categorizing options
 */
export interface AutocompleteGroup<TValue = string> {
  label: string;
  options: AutocompleteOption<TValue>[];
}

/**
 * Generic value type for single vs multi-select
 */
export type AutocompleteValue<
  TValue = string,
  TMultiple extends boolean = false
> = TMultiple extends true ? TValue[] : TValue | undefined;

/**
 * Filter function type for client-side filtering
 */
export type AutocompleteFilterFn<TValue = string> = (
  options: AutocompleteOption<TValue>[],
  query: string
) => AutocompleteOption<TValue>[];

/**
 * Async search function type for server-side search
 */
export type AutocompleteAsyncSearchFn<TValue = string> = (
  query: string,
  signal?: AbortSignal
) => Promise<AutocompleteOption<TValue>[]>;

/**
 * Custom render function for options
 */
export type AutocompleteRenderOption<TValue = string> = (
  option: AutocompleteOption<TValue>,
  state: { selected: boolean; focused: boolean; disabled: boolean }
) => ReactNode;

/**
 * Custom render function for displaying selected value(s)
 */
export type AutocompleteRenderValue<TValue = string> = (
  value: TValue | TValue[],
  options: AutocompleteOption<TValue>[]
) => ReactNode;

/**
 * Create handler for "create new" functionality
 */
export type AutocompleteOnCreateFn<TValue = string> = (
  query: string
) => AutocompleteOption<TValue> | Promise<AutocompleteOption<TValue>>;

/**
 * Filter options configuration
 */
export interface AutocompleteFilterOptions {
  matchFrom?: 'start' | 'any';
  ignoreCase?: boolean;
  ignoreAccents?: boolean;
  limit?: number;
}

/**
 * State managed by useAutocomplete hook
 */
export interface AutocompleteState<
  TValue = string,
  TMultiple extends boolean = false
> {
  // Selection state
  value: AutocompleteValue<TValue, TMultiple>;

  // Input state
  query: string;
  inputValue: string;

  // UI state
  open: boolean;
  loading: boolean;

  // Navigation state
  focusedIndex: number;

  // Filtered/searched options
  displayOptions: AutocompleteOption<TValue>[];
}

/**
 * Root Autocomplete component props
 */
export interface AutocompleteProps<
  TValue = string,
  TMultiple extends boolean = false
> {
  // Value management
  value?: AutocompleteValue<TValue, TMultiple>;
  defaultValue?: AutocompleteValue<TValue, TMultiple>;
  onValueChange?: (value: AutocompleteValue<TValue, TMultiple>) => void;

  // Multi-select mode
  multiple?: TMultiple;

  // Options (static or async)
  options?: AutocompleteOption<TValue>[];
  groups?: AutocompleteGroup<TValue>[];
  onSearch?: AutocompleteAsyncSearchFn<TValue>;

  // Filtering (client-side)
  filter?: AutocompleteFilterFn<TValue> | 'default' | false;
  filterOptions?: AutocompleteFilterOptions;

  // Create new functionality
  onCreate?: AutocompleteOnCreateFn<TValue>;
  createLabel?: string | ((query: string) => string);

  // Debouncing for async search
  debounceMs?: number;

  // UI customization
  placeholder?: string;
  emptyMessage?: string | ReactNode;
  loadingMessage?: string | ReactNode;
  renderOption?: AutocompleteRenderOption<TValue>;
  renderValue?: AutocompleteRenderValue<TValue>;

  // Virtual scrolling
  virtualizeOptions?: boolean;
  virtualizeThreshold?: number;

  // State control
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Behavior
  disabled?: boolean;
  closeOnSelect?: boolean;
  clearable?: boolean;

  // Validation
  error?: string;

  // Accessibility
  id?: string;
  name?: string;
  required?: boolean;

  // Styling
  className?: string;

  children?: ReactNode;
}

/**
 * Trigger component props
 */
export interface AutocompleteTriggerProps {
  placeholder?: string;
  className?: string;
  icon?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

/**
 * Content component props
 */
export interface AutocompleteContentProps {
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  children?: ReactNode;
}

/**
 * Item component props
 */
export interface AutocompleteItemProps<TValue = string> {
  value: TValue;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Group component props
 */
export interface AutocompleteGroupProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Group label component props
 */
export interface AutocompleteGroupLabelProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Empty state component props
 */
export interface AutocompleteEmptyProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Create item component props
 */
export interface AutocompleteCreateItemProps {
  children?: ReactNode;
  className?: string;
}

/**
 * List component props
 */
export interface AutocompleteListProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Separator component props
 */
export interface AutocompleteSeparatorProps {
  className?: string;
}

/**
 * Editable Autocomplete component props
 */
export interface EditableAutocompleteProps<
  TValue = string,
  TMultiple extends boolean = false
> extends Omit<
    AutocompleteProps<TValue, TMultiple>,
    'open' | 'defaultOpen' | 'onOpenChange'
  > {
  // Editable-specific props
  label?: string;
  onSave?: (value: AutocompleteValue<TValue, TMultiple>) => void | Promise<void>;
  onCancel?: () => void;
  validate?: (value: AutocompleteValue<TValue, TMultiple>) => string | undefined;
  viewClassName?: string;
  emptyPlaceholder?: string;
  inline?: boolean;
}
