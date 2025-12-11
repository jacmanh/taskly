import { AutocompleteOption, AutocompleteGroup } from './types';

/**
 * Flatten grouped options into a single array
 */
export function flattenOptions<TValue>(
  options: AutocompleteOption<TValue>[] = [],
  groups: AutocompleteGroup<TValue>[] = []
): AutocompleteOption<TValue>[] {
  const flatOptions = [...options];

  groups.forEach((group) => {
    flatOptions.push(...group.options);
  });

  return flatOptions;
}

/**
 * Find an option by its value
 */
export function findOptionByValue<TValue>(
  value: TValue,
  options: AutocompleteOption<TValue>[]
): AutocompleteOption<TValue> | undefined {
  return options.find((option) => option.value === value);
}

/**
 * Normalize string for comparison (case-insensitive, accent-insensitive)
 */
export function normalizeString(str: string, ignoreAccents = true): string {
  let normalized = str.toLowerCase();

  if (ignoreAccents) {
    normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  return normalized;
}

/**
 * Get display label for an option
 */
export function getOptionLabel<TValue>(
  option: AutocompleteOption<TValue>
): string {
  return option.label;
}

/**
 * Check if an option is selected
 */
export function isOptionSelected<TValue>(
  option: AutocompleteOption<TValue>,
  value: TValue | TValue[] | undefined,
  multiple: boolean
): boolean {
  if (value === undefined) return false;

  if (multiple && Array.isArray(value)) {
    return value.includes(option.value);
  }

  return option.value === value;
}

/**
 * Toggle selection for multi-select mode
 */
export function toggleSelection<TValue>(
  option: AutocompleteOption<TValue>,
  currentValue: TValue[] | undefined
): TValue[] {
  const valueArray = currentValue ?? [];
  const isSelected = valueArray.includes(option.value);

  if (isSelected) {
    return valueArray.filter((v) => v !== option.value);
  }

  return [...valueArray, option.value];
}

/**
 * Default filter function for client-side filtering
 */
export function defaultFilter<TValue>(
  options: AutocompleteOption<TValue>[],
  query: string,
  config: {
    matchFrom?: 'start' | 'any';
    ignoreCase?: boolean;
    ignoreAccents?: boolean;
    limit?: number;
  } = {}
): AutocompleteOption<TValue>[] {
  const {
    matchFrom = 'any',
    ignoreCase = true,
    ignoreAccents = true,
    limit,
  } = config;

  if (!query.trim()) {
    return limit ? options.slice(0, limit) : options;
  }

  const normalizedQuery = ignoreCase
    ? normalizeString(query, ignoreAccents)
    : query;

  const filtered = options.filter((option) => {
    let optionLabel = option.label;

    if (ignoreCase) {
      optionLabel = normalizeString(optionLabel, ignoreAccents);
    }

    if (matchFrom === 'start') {
      return optionLabel.startsWith(normalizedQuery);
    }

    return optionLabel.includes(normalizedQuery);
  });

  return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * Generate unique ID for ARIA attributes
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
