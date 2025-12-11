import { useCallback, KeyboardEvent } from 'react';

export interface UseAutocompleteKeyboardOptions {
  open: boolean;
  focusedIndex: number;
  optionsCount: number;
  onFocusChange: (index: number) => void;
  onSelect: () => void;
  onClose: () => void;
  onOpen: () => void;
}

export interface UseAutocompleteKeyboardReturn {
  onKeyDown: (e: KeyboardEvent) => void;
}

/**
 * Hook for keyboard navigation in autocomplete
 */
export function useAutocompleteKeyboard({
  open,
  focusedIndex,
  optionsCount,
  onFocusChange,
  onSelect,
  onClose,
  onOpen,
}: UseAutocompleteKeyboardOptions): UseAutocompleteKeyboardReturn {
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!open) {
            onOpen();
          } else if (focusedIndex < optionsCount - 1) {
            onFocusChange(focusedIndex + 1);
          } else {
            // Wrap around to first option
            onFocusChange(0);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (!open) {
            onOpen();
          } else if (focusedIndex > 0) {
            onFocusChange(focusedIndex - 1);
          } else {
            // Wrap around to last option
            onFocusChange(optionsCount - 1);
          }
          break;

        case 'Home':
          if (open) {
            e.preventDefault();
            onFocusChange(0);
          }
          break;

        case 'End':
          if (open) {
            e.preventDefault();
            onFocusChange(optionsCount - 1);
          }
          break;

        case 'Enter':
          if (open && focusedIndex >= 0 && focusedIndex < optionsCount) {
            e.preventDefault();
            onSelect();
          }
          break;

        case 'Escape':
          if (open) {
            e.preventDefault();
            onClose();
          }
          break;

        case 'Tab':
          if (open) {
            // Close on tab without selecting
            onClose();
          }
          break;

        default:
          // Type-ahead is handled by query state in main component
          break;
      }
    },
    [open, focusedIndex, optionsCount, onFocusChange, onSelect, onClose, onOpen]
  );

  return {
    onKeyDown,
  };
}
