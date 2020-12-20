import { TimeoutError, waitUntil, waitUntilAsync } from "./mod.ts";
import { deferred, denoDelay } from "../deps.ts";
import { assertEquals, assertThrowsAsync } from "../dev_deps.ts";
import { isTimeoutError } from "./wait.ts";

Deno.test({
  name: "waitAsync return function return code",
  fn: async () => {
    const delay = 1000;
    const result = Symbol("OK");
    const fn = () => {
      const p = deferred<typeof result>();
      p.resolve(result);
      return p;
    };
    const actualResult = await waitUntilAsync(fn, delay);
    assertEquals(actualResult, result);
    await denoDelay(delay);
  },
});

Deno.test({
  name: "waitAsync throw function exception",
  fn: async () => {
    const delay = 1000;
    const errorMsg = "BOOM";
    const fn = () => {
      throw new Error(errorMsg);
    };
    await assertThrowsAsync(
      async () => await waitUntilAsync(fn, delay),
      Error,
      errorMsg,
    );
    await denoDelay(delay);
  },
});

Deno.test({
  name: "waitAsync throw TimeoutError exception",
  fn: async () => {
    const delay = 1000;
    const fn = () => {
      return deferred();
    };
    const error = await assertThrowsAsync(
      async () => await waitUntilAsync(fn, delay),
      TimeoutError,
      "function did not complete within allowed time",
    );
    assertEquals((error as TimeoutError).isTimeout, true);
    await denoDelay(delay);
  },
});

Deno.test({
  name: "waitAsync throw custom Error exception",
  fn: async () => {
    const delay = 1000;
    const fn = () => {
      return deferred();
    };
    const errorMsg = "BOOM";
    const error = await assertThrowsAsync(
      async () => await waitUntil(fn, delay, new Error(errorMsg)),
      Error,
      errorMsg,
    );
    // deno-lint-ignore no-explicit-any
    assertEquals((error as any).isTimeout, undefined);
    await denoDelay(delay);
  },
});

Deno.test({
  name: "wait return function return code",
  fn: async () => {
    const delay = 1000;
    const result = Symbol("OK");
    const fn = () => result;
    const actualResult = await waitUntil(fn, delay);
    assertEquals(actualResult, result);
    await denoDelay(delay);
  },
});

Deno.test({
  name: "wait throw function exception",
  fn: async () => {
    const delay = 1000;
    const errorMsg = "BOOM";
    const fn = () => {
      throw new Error(errorMsg);
    };
    await assertThrowsAsync(
      async () => await waitUntil(fn, delay),
      Error,
      errorMsg,
    );
    await denoDelay(delay);
  },
});

Deno.test({
  name: "wait throw TimeoutError exception",
  fn: async () => {
    const delay = 1000;
    const fn = () => {
      return deferred();
    };
    const error = await assertThrowsAsync(
      async () => await waitUntil(fn, delay),
      TimeoutError,
      "function did not complete within allowed time",
    );
    assertEquals((error as TimeoutError).isTimeout, true);
    await denoDelay(delay);
  },
});

Deno.test({
  name: "wait throw custom Error exception",
  fn: async () => {
    const delay = 1000;
    const fn = () => {
      return deferred();
    };
    const errorMsg = "BOOM";
    const error = await assertThrowsAsync(
      async () => await waitUntil(fn, delay, new Error(errorMsg)),
      Error,
      errorMsg,
    );
    // deno-lint-ignore no-explicit-any
    assertEquals((error as any).isTimeout, undefined);
    await denoDelay(delay);
  },
});

Deno.test({
  name: "isTimeoutError should return true for timeout error",
  fn: () => {
    const error = new TimeoutError("bla bla bla");
    assertEquals(isTimeoutError(error), true);
  },
});

Deno.test({
  name: "isTimeoutError should return false for non timeout error",
  fn: () => {
    const error = new Error("bla bla bla");
    assertEquals(isTimeoutError(error), false);
  },
});
