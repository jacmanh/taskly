export type RuntimeEnvironment = 'development' | 'test' | 'preview' | 'production';
export type FeatureFlagName = 'taskInlineEdit';

export interface FeatureFlagDefinition {
  description: string;
  defaultValue: boolean;
  environments?: Partial<Record<RuntimeEnvironment, boolean>>;
}

const runtimeEnv = (
  process.env.NEXT_PUBLIC_APP_ENV ||
  process.env.NEXT_PUBLIC_RUNTIME_ENV ||
  process.env.NODE_ENV ||
  'development'
) as RuntimeEnvironment;

const featureFlagDefinitions: Record<FeatureFlagName, FeatureFlagDefinition> = {
  taskInlineEdit: {
    description:
      'Gates inline editing experiences in the task viewer so we can safely roll out the new UX.',
    defaultValue: false,
    environments: {
      development: true,
      test: true,
      preview: false,
      production: false,
    },
  },
};

const featureFlagOverrideEnvKeys: Record<FeatureFlagName, readonly string[]> = {
  taskInlineEdit: [
    'NEXT_PUBLIC_FEATURE_TASK_INLINE_EDIT',
    'FEATURE_TASK_INLINE_EDIT',
  ],
};

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  if (['1', 'true', 'on', 'enabled', 'enable', 'yes'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'off', 'disabled', 'disable', 'no'].includes(normalized)) {
    return false;
  }
  return undefined;
}

function readOverride(flag: FeatureFlagName): boolean | undefined {
  for (const key of featureFlagOverrideEnvKeys[flag]) {
    const rawValue = process.env[key];
    const parsedValue = parseBoolean(rawValue);
    if (typeof parsedValue === 'boolean') {
      return parsedValue;
    }
  }
  return undefined;
}

export function isFeatureEnabled(
  flag: FeatureFlagName,
  env: RuntimeEnvironment = runtimeEnv
): boolean {
  const override = readOverride(flag);
  if (typeof override === 'boolean') {
    return override;
  }

  const definition = featureFlagDefinitions[flag];
  if (definition.environments && definition.environments[env] !== undefined) {
    return definition.environments[env] as boolean;
  }

  return definition.defaultValue;
}

export function resolveFeatureFlags(
  env: RuntimeEnvironment = runtimeEnv
): Record<FeatureFlagName, boolean> {
  return (Object.keys(featureFlagDefinitions) as FeatureFlagName[]).reduce(
    (acc, flag) => {
      acc[flag] = isFeatureEnabled(flag, env);
      return acc;
    },
    {} as Record<FeatureFlagName, boolean>
  );
}

export const featureFlags = resolveFeatureFlags();

export function getRuntimeEnvironment(): RuntimeEnvironment {
  return runtimeEnv;
}
