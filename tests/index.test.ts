import { expect, test, vi } from "vitest";
import { createEventEmitter } from "../src";

test("createEventEmitter", async () => {
  const fn = vi.fn().mockResolvedValue(undefined);
  const emitter = createEventEmitter({
    on: {
      a: fn,
    },
  });
  await emitter.emit("a", { a: "b" });
  expect(fn).toHaveBeenCalled();
});
