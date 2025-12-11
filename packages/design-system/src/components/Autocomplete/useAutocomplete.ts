import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import {
  AutocompleteOption,
  AutocompleteValue,
  AutocompleteProps,
} from './types';
import { useAutocompleteFilter } from './useAutocompleteFilter';
import { useAutocompleteAsync } from './useAutocompleteAsync';
import { useAutocompleteKeyboard } from './useAutocompleteKeyboard';
import {
  flattenOptions,
  findOptionByValue,
  isOptionSelected,
  toggleSelection,
} from './utils';

export interface UseAutocompleteReturn<
  TValue = string,
  TMultiple extends boolean = false
> {
  // State
  state: {
    value: AutocompleteValue<TValue, TMultiple>;
    query: string;
    open: boolean;
    loading: boolean;
    focusedIndex: number;
    displayOptions: AutocompleteOption<TValue>[];
  };

  // Actions
  actions: {
    setQuery: (query: string) => void;
    setOpen: (open: boolean) => void;
    selectOption: (option: AutocompleteOption<TValue>) => void;
    clearSelection: () => void;
    focusNext: () => void;
    focusPrevious: () => void;
    focusFirst: () => void;
    focusLast: () => void;
    selectFocused: () => void;
  };

  // Computed
  computed: {
    selectedOptions: AutocompleteOption<TValue>[];
    focusedOption: AutocompleteOption<TValue> | undefined;
    isEmpty: boolean;
    hasValue: boolean;
  };

  // Refs
  refs: {
    triggerRef: React.RefObject<HTMLInputElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
    listRef: React.RefObject<HTMLDivElement | null>;
  };

  // Handlers
  handlers: {
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onInputKeyDown: (e: KeyboardEvent) => void;
    onInputFocus: () => void;
    onInputBlur: () => void;
    onClear: () => void;
  };
}

/**
 * Core hook that manages all autocomplete state and coordinates other hooks
 */
export function useAutocomplete<
  TValue = string,
  TMultiple extends boolean = false
>(
  props: AutocompleteProps<TValue, TMultiple>
): UseAutocompleteReturn<TValue, TMultiple> {
  const {
    value: controlledValue,
    defaultValue,
    onValueChange,
    multiple = false as TMultiple,
    options = [],
    groups = [],
    onSearch,
    filter = 'default',
    filterOptions,
    debounceMs = 300,
    disabled = false,
    closeOnSelect,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
  } = props;

  // Determine if we're using async search
  const isAsync = Boolean(onSearch);

  // Value state (controlled/uncontrolled)
  const [internalValue, setInternalValue] = useState<
    AutocompleteValue<TValue, TMultiple>
  >(defaultValue ?? (multiple ? ([] as TValue[]) : undefined) as AutocompleteValue<TValue, TMultiple>);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // Query state
  const [query, setQuery] = useState('');

  // Open state (controlled/uncontrolled)
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  // Focused index for keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Refs
  const triggerRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Async search hook
  const { options: asyncOptions, loading: asyncLoading } =
    useAutocompleteAsync({
      onSearch,
      query,
      debounceMs,
      enabled: isAsync,
    });

  // Determine which options to use
  const sourceOptions = isAsync ? asyncOptions : options;

  // Client-side filtering hook
  const { filteredOptions, filteredGroups } = useAutocompleteFilter({
    options: sourceOptions,
    groups: isAsync ? undefined : groups,
    query,
    filter: isAsync ? false : filter,
    filterOptions,
  });

  // Flatten all options for easier access
  const allFlatOptions = useMemo(
    () => flattenOptions(filteredOptions, filteredGroups),
    [filteredOptions, filteredGroups]
  );

  // Loading state
  const loading = asyncLoading;

  // Set open state
  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (disabled) return;

      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);

      // Reset focused index when opening/closing
      if (!newOpen) {
        setFocusedIndex(-1);
        setQuery('');
      }
    },
    [controlledOpen, onOpenChange, disabled]
  );

  // Select option
  const selectOption = useCallback(
    (option: AutocompleteOption<TValue>) => {
      if (option.disabled) return;

      let newValue: AutocompleteValue<TValue, TMultiple>;

      if (multiple) {
        newValue = toggleSelection(
          option,
          value as TValue[] | undefined
        ) as AutocompleteValue<TValue, TMultiple>;
      } else {
        newValue = option.value as AutocompleteValue<TValue, TMultiple>;
      }

      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);

      // Determine if we should close
      const shouldClose = closeOnSelect ?? !multiple;
      if (shouldClose) {
        setOpen(false);
      }
    },
    [
      multiple,
      value,
      controlledValue,
      onValueChange,
      closeOnSelect,
      setOpen,
    ]
  );

  // Clear selection
  const clearSelection = useCallback(() => {
    const newValue = (multiple ? [] : undefined) as AutocompleteValue<
      TValue,
      TMultiple
    >;

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  }, [multiple, controlledValue, onValueChange]);

  // Keyboard navigation actions
  const focusNext = useCallback(() => {
    if (focusedIndex < allFlatOptions.length - 1) {
      setFocusedIndex(focusedIndex + 1);
    } else {
      setFocusedIndex(0);
    }
  }, [focusedIndex, allFlatOptions.length]);

  const focusPrevious = useCallback(() => {
    if (focusedIndex > 0) {
      setFocusedIndex(focusedIndex - 1);
    } else {
      setFocusedIndex(allFlatOptions.length - 1);
    }
  }, [focusedIndex, allFlatOptions.length]);

  const focusFirst = useCallback(() => {
    setFocusedIndex(0);
  }, []);

  const focusLast = useCallback(() => {
    setFocusedIndex(allFlatOptions.length - 1);
  }, [allFlatOptions.length]);

  const selectFocused = useCallback(() => {
    if (focusedIndex >= 0 && focusedIndex < allFlatOptions.length) {
      const option = allFlatOptions[focusedIndex];
      selectOption(option);
    }
  }, [focusedIndex, allFlatOptions, selectOption]);

  // Keyboard handler
  const { onKeyDown } = useAutocompleteKeyboard({
    open,
    focusedIndex,
    optionsCount: allFlatOptions.length,
    onFocusChange: setFocusedIndex,
    onSelect: selectFocused,
    onClose: () => setOpen(false),
    onOpen: () => setOpen(true),
  });

  // Input change handler
  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Reset focused index when query changes
    setFocusedIndex(-1);
  }, []);

  // Input focus handler
  const onInputFocus = useCallback(() => {
    if (!disabled) {
      setOpen(true);
    }
  }, [disabled, setOpen]);

  // Input blur handler
  const onInputBlur = useCallback(() => {
    // Delay closing to allow click on option
    setTimeout(() => {
      // Only close if not focused on content
      if (
        document.activeElement !== contentRef.current &&
        !contentRef.current?.contains(document.activeElement)
      ) {
        setOpen(false);
      }
    }, 150);
  }, [setOpen]);

  // Clear handler
  const onClear = useCallback(() => {
    clearSelection();
    setQuery('');
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [clearSelection]);

  // Computed values
  const selectedOptions = useMemo(() => {
    if (value === undefined) return [];

    const allOptions = flattenOptions(sourceOptions, groups);

    if (multiple && Array.isArray(value)) {
      return value
        .map((v) => findOptionByValue(v, allOptions))
        .filter((opt): opt is AutocompleteOption<TValue> => opt !== undefined);
    }

    const option = findOptionByValue(value as TValue, allOptions);
    return option ? [option] : [];
  }, [value, multiple, sourceOptions, groups]);

  const focusedOption = useMemo(() => {
    if (focusedIndex >= 0 && focusedIndex < allFlatOptions.length) {
      return allFlatOptions[focusedIndex];
    }
    return undefined;
  }, [focusedIndex, allFlatOptions]);

  const isEmpty = value === undefined || (Array.isArray(value) && value.length === 0);
  const hasValue = !isEmpty;

  // Scroll focused option into view
  useEffect(() => {
    if (focusedOption && listRef.current) {
      const optionElement = listRef.current.querySelector(
        `[data-value="${String(focusedOption.value)}"]`
      );
      if (optionElement) {
        optionElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedOption]);

  return {
    state: {
      value,
      query,
      open,
      loading,
      focusedIndex,
      displayOptions: allFlatOptions,
    },
    actions: {
      setQuery,
      setOpen,
      selectOption,
      clearSelection,
      focusNext,
      focusPrevious,
      focusFirst,
      focusLast,
      selectFocused,
    },
    computed: {
      selectedOptions,
      focusedOption,
      isEmpty,
      hasValue,
    },
    refs: {
      triggerRef,
      contentRef,
      listRef,
    },
    handlers: {
      onInputChange,
      onInputKeyDown: onKeyDown,
      onInputFocus,
      onInputBlur,
      onClear,
    },
  };
}
