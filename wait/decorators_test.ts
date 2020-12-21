import { deferred } from "https://deno.land/std@0.81.0/async/deferred.ts";
import { waitUntilAsyncDecorator, waitUntilDecorator } from "./decorators.ts";
import { assertEquals, assertThrowsAsync } from "../dev_deps.ts";
import { TimeoutError } from "./wait.ts";
import { denoDelay } from "../deps.ts";

Deno.test({
  name: "waitUntilAsyncDecorator should execute the function",
  fn: async () => {
    const timeout = 100;
    const fn = (msg: string, count: number): Promise<string> => {
      const promise = deferred<string>();
      promise.resolve(`${msg} ${count}`);
      return promise;
    };
    const decoratedFn = waitUntilAsyncDecorator(fn, timeout);
    assertEquals(await decoratedFn("The answer is", 42), "The answer is 42");
    await denoDelay(timeout);
  },
});

Deno.test({
  name: "waitUntilAsyncDecorator should throw the function error",
  fn: async () => {
    const timeout = 100;
    const errorMsg = "BOOM";
    const fn = (): Promise<string> => {
      const promise = deferred<string>();
      promise.reject(new Error(errorMsg));
      return promise;
    };
    const decoratedFn = waitUntilAsyncDecorator(fn, timeout);
    await assertThrowsAsync(
      async () => await decoratedFn(),
      Error,
      errorMsg,
    );
    await denoDelay(timeout);
  },
});

Deno.test({
  name: "waitUntilAsyncDecorator should throw an error in case of timeout",
  fn: async () => {
    const timeout = 100;
    const fn = (msg: string, count: number): Promise<string> => {
      const promise = deferred<string>();
      setTimeout(
        () => promise.resolve(`${msg} ${count}`),
        timeout + 50,
      );
      return promise;
    };
    const decoratedFn = waitUntilAsyncDecorator(fn, timeout);
    await assertThrowsAsync(
      async () => await decoratedFn("The answer is", 42),
      TimeoutError,
    );
    await denoDelay(timeout);
  },
});

Deno.test({
  name:
    "waitUntilAsyncDecorator should throw a custom error in case of timeout",
  fn: async () => {
    const timeout = 100;
    const errorMsg = "BOOM";
    const fn = (msg: string, count: number): Promise<string> => {
      const promise = deferred<string>();
      setTimeout(
        () => promise.resolve(`${msg} ${count}`),
        timeout + 50,
      );
      return promise;
    };
    const decoratedFn = waitUntilAsyncDecorator(
      fn,
      timeout,
      new Error(errorMsg),
    );
    await assertThrowsAsync(
      async () => await decoratedFn("The answer is", 42),
      Error,
      errorMsg,
    );
    await denoDelay(timeout);
  },
});

// ---
Deno.test({
  name: "waitUntilDecorator should execute the function",
  fn: async () => {
    const timeout = 100;
    const fn = (msg: string, count: number): string => {
      return `${msg} ${count}`;
    };
    const decoratedFn = waitUntilDecorator(fn, timeout);
    assertEquals(await decoratedFn("The answer is", 42), "The answer is 42");
    await denoDelay(timeout);
  },
});

Deno.test({
  name: "waitUntilDecorator should throw the function error",
  fn: async () => {
    const timeout = 100;
    const errorMsg = "BOOM";
    const fn = (msg: string, count: number): Promise<string> => {
      throw new Error(errorMsg);
    };
    const decoratedFn = waitUntilDecorator(fn, timeout);
    await assertThrowsAsync(
      async () => await decoratedFn("The answer is", 42),
      Error,
      errorMsg,
    );
    await denoDelay(timeout);
  },
});

Deno.test({
  name: "waitUntilDecorator should throw an error in case of timeout",
  fn: async () => {
    const timeout = 1;
    const fn = (msg: string, count: number): Promise<string> => {
      const promise = deferred<string>();
      return promise;
    };
    const decoratedFn = waitUntilDecorator(fn, timeout);
    await assertThrowsAsync(
      async () => await decoratedFn("The answer is", 42),
      TimeoutError,
    );
    await denoDelay(timeout);
  },
});

Deno.test({
  name: "waitUntilDecorator should throw a custom error in case of timeout",
  fn: async () => {
    const timeout = 100;
    const errorMsg = "BOOM";
    const fn = (msg: string, count: number): Promise<string> => {
      const promise = deferred<string>();
      return promise;
    };
    const decoratedFn = waitUntilDecorator(
      fn,
      timeout,
      new Error(errorMsg),
    );
    await assertThrowsAsync(
      async () => await decoratedFn("The answer is", 42),
      Error,
      errorMsg,
    );
    await denoDelay(timeout);
  },
});
