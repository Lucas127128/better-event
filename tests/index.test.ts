import { expect, it, vi, describe } from 'vitest';
import { createEventEmitter } from '../src';

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
});
