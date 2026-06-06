export function createEventEmitter<T extends Record<string, (data: any) => Promise<void>>>(params: {
  on: T;
  debug?: { name: string };
}) {
  const events = params.on;
  const debug = params.debug ?? false;

  return {
    emit: async <K extends keyof T>(eventKey: K, data: Parameters<T[K]>[0]) => {
      const handler = events[eventKey];
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
  };
}
