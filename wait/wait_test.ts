import { TimeoutError, waitUntil, waitUntilAsync } from "./mod.ts";
import { deferred, denoDelay } from "../deps.ts";
import { assertEquals, assertThrowsAsync } from "../dev_deps.ts";

Deno.test("waitAsync return function return code", async () => {
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
});

Deno.test("waitAsync throw function exception", async () => {
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
});

Deno.test("waitAsync throw TimeoutError exception", async () => {
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
});

Deno.test("waitAsync throw custom Error exception", async () => {
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
});

Deno.test("wait return function return code", async () => {
  const delay = 1000;
  const result = Symbol("OK");
  const fn = () => result;
  const actualResult = await waitUntil(fn, delay);
  assertEquals(actualResult, result);
  await denoDelay(delay);
});

Deno.test("wait throw function exception", async () => {
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
});

Deno.test("wait throw TimeoutError exception", async () => {
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
});

Deno.test("wait throw custom Error exception", async () => {
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
});
