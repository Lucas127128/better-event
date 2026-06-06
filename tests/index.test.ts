import { expect, test, vi, describe } from 'vitest';
import { createEventEmitter } from '../src';

describe('createEventEmitter', () => {
  test('emit', async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const emitter = createEventEmitter({
      on: {
        a: { handler: fn },
      },
    });
    await emitter.emit('a', { a: 'b' });
    expect(fn).toHaveBeenCalled();
  });
});
