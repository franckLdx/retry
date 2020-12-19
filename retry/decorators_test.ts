import { deferred } from "https://deno.land/std@0.81.0/async/deferred.ts";
import { retryAsyncDecorator } from "./decorator.ts";
import { assertEquals, assertThrowsAsync } from "../dev_deps.ts";

Deno.test({
  name: "async decorator should return the valid result",
  fn: async () => {
    const fn = (p1: string, p2: number) => {
      const promise = deferred<number>();
      promise.resolve(Number(p1) * p2);
      return promise;
    };
    const decorated = retryAsyncDecorator(fn);
    assertEquals(await decorated("10", 2), 20);
  },
});

Deno.test({
  name: "async decorator should throw an exception",
  fn: async () => {
    let callCount = 0;
    const errorMsg = "BOOM";
    const fn = () => {
      callCount++;
      const promise = deferred();
      promise.reject(new Error(errorMsg));
      return promise;
    };
    const decorated = retryAsyncDecorator(fn, { maxTry: 2, delay: 50 });
    await assertThrowsAsync(
      async () => await decorated(),
      Error,
      errorMsg,
    );
    assertEquals(callCount, 2);
  },
});
