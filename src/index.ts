type EventHandler<T> = (data: T) => Promise<void>;
type EventMap = Record<string, { handler: EventHandler<any>; signal?: AbortSignal }>;
export type EventEmitter<T extends EventMap> = ReturnType<typeof createEventEmitter<T>>;

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
 *       debug: { name: 'event' },
 *     },
 *   },
 * });
 * ```
 */
export function createEventEmitter<T extends EventMap>(params: {
  /** The event map defining event names and handlers.
   * @property handler - the event handler function to call when the event is emitted
   * @property debug - a name for the event to be console.log() when event is emitted
   */
  on: T;
  /** (Optional) a name for the event to be console.log() when event is emitted
   * @property name - the name of the event to be logged */
  debug?: { name: string };
}) {
  const events = params.on;
  const debug = params.debug ?? undefined;
  attachAbortListener(events, !!debug);

  return {
    /**Emit an event with the key and data.
     *
     * @param eventKey - the key of the event to emit
     * @param data - the data to pass to the event handler
     * @example
     * ```ts
     * emitter.emit('event', 'data');
     * ```
     */
    emit: async <K extends keyof T>(
      eventKey: K,
      ...args: Parameters<T[K]['handler']>[0] extends undefined
        ? [data?: never]
        : [data: Parameters<T[K]['handler']>[0]]
    ) => {
      const handler = events[eventKey].handler;
      const [data] = args;
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
    /** Disable an event
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
     * //nothing happens
     * emitter.emit('event');
     * ```
     */
    disable: (eventKey: keyof T) => {
      events[eventKey].handler = () => Promise.resolve();
      if (debug) {
        console.log(`Event ${String(eventKey)} disabled`);
      }
    },
  };
}
