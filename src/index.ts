type EventHandler<T> = (data: T) => Promise<void>;
type EventMap = Record<string, { handler: EventHandler<any>; signal?: AbortSignal }>;

function attachAbortListener(events: EventMap, debug: boolean) {
  for (const [eventKey, event] of Object.entries(events)) {
    if (event.signal) {
      event.signal.addEventListener('abort', () => {
        events[eventKey].handler = () => Promise.resolve();
        if (debug) {
          console.log(`Event ${eventKey} aborted`);
        }
      });
    }
  }
}

/**
 * Creates an event emitter that allows you to define and emit events with async handlers.
 * @param params - The event emitter configuration.
 * @returns An object with an `emit` method to trigger events.
 */
export function createEventEmitter<T extends EventMap>(params: {
  on: T;
  debug?: { name: string };
}) {
  const events = params.on;
  const debug = params.debug ?? undefined;
  attachAbortListener(events, !!debug);

  return {
    emit: async <K extends keyof T>(eventKey: K, data: Parameters<T[K]['handler']>[0]) => {
      const handler = events[eventKey].handler;
      await handler(data);
      if (debug) {
        console.log({
          time: new Date().toLocaleString(),
          name: debug.name,
          eventKey: String(eventKey),
          data,
        });
      }
    },
    disable: (eventKey: keyof T) => {
      events[eventKey].handler = () => Promise.resolve();
      if (debug) {
        console.log(`Event ${String(eventKey)} disabled`);
      }
    },
  };
}
