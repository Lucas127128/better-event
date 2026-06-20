import { expect, it, vi, describe, expectTypeOf } from 'vitest';
import { createEventEmitter, TimeoutError } from '../src';

describe.concurrent('createEventEmitter', () => {
  it('emit', async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const emitter = createEventEmitter({
      on: {
        a: { handler: fn },
      },
    });
    await emitter.emit('a', { a: 'b' });
    expect(fn).toHaveBeenCalled();
  });
  it('disable', async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const emitter = createEventEmitter({
      on: {
        a: { handler: fn },
      },
    });
    emitter.disable('a');
    await emitter.emit('a', { a: 'b' });
    expect(fn).not.toHaveBeenCalled();
  });
  it('abort', async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const controller = new AbortController();
    const { signal } = controller;
    const emitter = createEventEmitter({
      on: {
        a: { handler: fn, signal },
      },
    });
    controller.abort();
    await emitter.emit('a', { a: 'b' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('reject timeout with TimeoutError, which has correct name, timeout, and eventKey properties', async () => {
    try {
      const emitter = createEventEmitter({
        on: {
          testEvent: { handler: async () => new Promise(() => {}), timeout: 5 },
        },
      });
      await emitter.emit('testEvent');
    } catch (error) {
      expect(error).toBeInstanceOf(TimeoutError);
      if (!(error instanceof TimeoutError)) return;
      expect(error.name).toBe('TimeoutError');
      expect(error.timeout).toBe(5);
      expect(error.eventKey).toBe('testEvent');
    }
  });

  it('disable works with plain handler (non-object form)', async () => {
    const fn = vi.fn(() => {});
    const emitter = createEventEmitter({
      on: { a: fn },
    });
    emitter.disable('a');
    await emitter.emit('a');
    expect(fn).not.toHaveBeenCalled();
  });

  it('debug logs on emit', async () => {
    const log = vi.fn();
    const fn = vi.fn().mockResolvedValue(undefined);
    const emitter = createEventEmitter({
      on: { a: { handler: fn } },
      debug: { name: 'test-debug', logger: log },
    });
    await emitter.emit('a', 'data');
    expect(log).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'test-debug', eventKey: 'a', data: 'data' }),
    );
  });

  it('debug logs on disable', async () => {
    const log = vi.fn();
    const fn = vi.fn().mockResolvedValue(undefined);
    const emitter = createEventEmitter({
      on: { a: { handler: fn } },
      debug: { name: 'test-debug', logger: log },
    });
    emitter.disable('a');
    expect(log).toHaveBeenCalledWith('Event a disabled');
  });

  it('abort with debug logs using custom logger', async () => {
    const log = vi.fn(console.log);
    const fn = vi.fn(() => {}).mockResolvedValue(undefined);
    const controller = new AbortController();
    const { signal } = controller;
    const emitter = createEventEmitter({
      on: { a: { handler: fn, signal } },
      debug: { name: 'test', logger: log },
    });
    controller.abort();
    await emitter.emit('a');
    expect(fn).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith('Event a aborted');
  });

  it('abort with debug logs', async () => {
    using spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const fn = vi.fn().mockResolvedValue(undefined);
    const controller = new AbortController();
    const { signal } = controller;
    const emitter = createEventEmitter({
      on: { a: { handler: fn, signal } },
      debug: { name: 'test' },
    });
    controller.abort();
    await emitter.emit('a', 'data');
    expect(fn).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('Event a aborted');
  });

  it('infer type for .emit() when data is needed', () => {
    const fn = vi.fn((data: string) => {});
    const emitter = createEventEmitter({ on: { a: fn } });
    expectTypeOf(emitter.emit).toBeCallableWith('a', '');
    type Data = Parameters<typeof emitter.emit<'a'>>;
    expectTypeOf<Data[1]>().toBeString();
  });
  it('infer type for .emit() when data is not needed', () => {
    const fn = vi.fn(() => {});
    const emitter = createEventEmitter({ on: { a: fn } });
    expectTypeOf(emitter.emit).toBeCallableWith('a');
    type Data = Parameters<typeof emitter.emit<'a'>>;
    expectTypeOf<Data>().toEqualTypeOf<[eventKey: 'a']>();
  });
});
