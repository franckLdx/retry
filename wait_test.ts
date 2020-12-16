import { TimeoutError, waitUntil } from "./wait.ts";
import { deferred, deno_delay } from "./deps.ts";
import { assertEquals, assertThrowsAsync } from "./dev_deps.ts";

Deno.test("wait should return function return code", async () => {
  const delay = 1000;
  const result = Symbol("OK");
  const fn = async () => result;
  const actualResult = await waitUntil(fn, delay);
  assertEquals(actualResult, result);
  await deno_delay(delay);
});

Deno.test("wait should throw function exception", async () => {
  const delay = 1000;
  const errorMsg = "BOOM";
  const fn = async () => {
    throw new Error(errorMsg);
  };
  await assertThrowsAsync(
    async () => await waitUntil(fn, delay),
    Error,
    errorMsg,
  );
  await deno_delay(delay);
});

Deno.test("wait should throw TimeoutError exception", async () => {
  const delay = 1000;
  const fn = async () => {
    return deferred();
  };
  const error = await assertThrowsAsync(
    async () => await waitUntil(fn, delay),
    TimeoutError,
    "function did not complete within allowed time",
  );
  assertEquals((error as TimeoutError).isTimeout, true);
  await deno_delay(delay);
});

Deno.test("wait should throw custom Error exception", async () => {
  const delay = 1000;
  const fn = async () => {
    return deferred();
  };
  const errorMsg = "BOOM";
  const error = await assertThrowsAsync(
    async () => await waitUntil(fn, delay, new Error(errorMsg)),
    Error,
    errorMsg,
  );
  assertEquals((error as any).isTimeout, undefined);
  await deno_delay(delay);
});
