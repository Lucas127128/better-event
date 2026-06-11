type EventHandler<T> = (data: T) => Promise<void> | void;
type EventMap = Record<
  string,
  { handler: EventHandler<any>; signal?: AbortSignal; timeout?: number } | EventHandler<any>
>;
export type EventEmitter<T extends EventMap> = ReturnType<typeof createEventEmitter<T>>;

/**
 * Error thrown when an event handler exceeds its configured timeout.
 */
export class TimeoutError extends Error {
  constructor(timeout: number, eventKey: string) {
    super(`Event ${eventKey} timed out`);
    this.name = 'TimeoutError';
    this.timeout = timeout;
    this.eventKey = eventKey;
  }
  /** The timeout duration in milliseconds. */
  timeout;
  /** The key of the event that timed out. */
  eventKey;
}

/**
 * Creates an event emitter with async handlers.
 * @param params - The event handler and configuration.
 * @returns An EventEmitter instance.
 * @example
 * ```ts
 * const emitter = createEventEmitter({
 *   on: {
 *     event: {
 *       handler: async (data: string) => {
 *         console.log(data);
 *       },
 *     },
 *   },
 * });
 * ```
 */
export function createEventEmitter<T extends EventMap>(params: {
  /** The event map defining event names and handlers.
   * @property handler - the event handler function to call when the event is emitted
   * @property signal - (optional) an AbortSignal to abort the event listener
   * @property timeout - (optional) the maximum time in milliseconds to wait for the event handler to complete
   */
  on: T;
  /** (Optional) a name for the event to be console.log() when event is emitted
   * @property name - the name of the event to be logged */
  debug?: { name: string };
}) {
  type EventKeys = keyof T;
  const events = params.on;
  const debug = params.debug ?? undefined;
  attachAbortListener(events, !!debug);

  return {
    /**Emit an event with the key and data.
     *
     * @param eventKey - the key of the event to emit
     * @param data - the data to pass to the event handler
     * @throws {TimeoutError} if the event handler does not complete within the specified timeout
     * @example
     * ```ts
     * emitter.emit('event', 'data');
     * ```
     */
    emit: async <K extends EventKeys>(
      eventKey: K,
      ...args: T[K] extends EventHandler<any>
        ? [data: Parameters<T[K]>[0]]
        : T[K] extends { handler: EventHandler<any> }
          ? Parameters<T[K]['handler']>[0] extends undefined
            ? []
            : [data: Parameters<T[K]['handler']>[0]]
          : never
    ) => {
      const handler: EventHandler<any> =
        'handler' in events[eventKey] ? events[eventKey].handler : events[eventKey];
      const timeout = 'timeout' in events[eventKey] ? events[eventKey].timeout : undefined;
      const [data] = args;
      await Promise.race([
        handler(data),
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new TimeoutError(timeout ?? 0, String(eventKey)));
          }, timeout ?? 0);
        }),
      ]);

      if (debug) {
        console.log({
          time: new Date().toLocaleString(),
          name: debug.name,
          eventKey: String(eventKey),
          data,
        });
      }
    },
    /** Disable an event. After disabling, emitting the event does nothing.
     * @param eventKey - the key of the event to disable
     * @example
     * ```ts
     * const emitter = createEventEmitter({
     *   on: {
     *     event: {
     *       handler: async () => {
     *         console.log('hello world');
     *       },
     *     },
     *   },
     * });
     * emitter.disable('event');
     * emitter.emit('event');
     * // nothing happens
     * ```
     */
    disable: <K extends EventKeys>(eventKey: K) => {
      if ('handler' in events[eventKey]) events[eventKey].handler = () => Promise.resolve();
      else (events[eventKey] as EventHandler<any>) = () => Promise.resolve();

      if (debug) console.log(`Event ${String(eventKey)} disabled`);
    },
  };
}

function attachAbortListener(events: EventMap, debug: boolean) {
  for (const [eventKey, event] of Object.entries(events)) {
    if (!('handler' in event)) return;

    event.signal?.addEventListener('abort', () => {
      event.handler = () => Promise.resolve();
      if (debug) console.log(`Event ${eventKey} aborted`);
    });
  }
}
