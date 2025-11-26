export type TelemetryAttributes = Record<string, string | number | boolean | null | undefined>;

export interface TelemetryEvent<T extends TelemetryAttributes = TelemetryAttributes> {
  name: string;
  attributes?: T;
  timestamp?: number;
}

export type TelemetryDispatcher<T extends TelemetryAttributes = TelemetryAttributes> = (
  event: TelemetryEvent<T>
) => Promise<void> | void;

/**
 * Lightweight telemetry hub that fans out events to registered dispatchers.
 */
export class TelemetryHub {
  private dispatchers: TelemetryDispatcher[] = [];

  constructor(initialDispatchers: TelemetryDispatcher[] = []) {
    this.dispatchers = initialDispatchers;
  }

  register(dispatcher: TelemetryDispatcher) {
    this.dispatchers.push(dispatcher);
  }

  async emit<T extends TelemetryAttributes>(event: TelemetryEvent<T>): Promise<void> {
    const payload = {
      timestamp: Date.now(),
      ...event,
    };

    await Promise.all(
      this.dispatchers.map(async (dispatcher) => {
        try {
          await dispatcher(payload);
        } catch (error) {
          if (process.env['NODE_ENV'] !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('[telemetry] dispatcher failed', error);
          }
        }
      })
    );
  }
}

export function createConsoleDispatcher(): TelemetryDispatcher {
  return (event) => {
    // eslint-disable-next-line no-console
    console.info('[telemetry event]', event.name, event.attributes || {});
  };
}

export const defaultTelemetryHub = new TelemetryHub([createConsoleDispatcher()]);

export async function trackEvent<T extends TelemetryAttributes>(
  event: TelemetryEvent<T>
): Promise<void> {
  return defaultTelemetryHub.emit(event);
}
