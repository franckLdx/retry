// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { retryAsyncDecorator, retryDecorator } from "./decorator.ts";
import { assertEquals, assertThrowsAsync, deferred } from "../dev_deps.ts";
import { isTooManyTries } from "./tooManyTries.ts";

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

Deno.test({
  name: "decorator should return the valid result",
  fn: async () => {
    const fn = (p1: string, p2: number) => {
      return Number(p1) * p2;
    };
    const decorated = retryDecorator(fn);
    assertEquals(await decorated("10", 2), 20);
  },
});

Deno.test({
  name: "decorator should throw an exception",
  fn: async () => {
    let callCount = 0;
    const errorMsg = "BOOM";
    const fn = () => {
      callCount++;
      throw new Error(errorMsg);
    };
    const decorated = retryDecorator(fn, { maxTry: 2, delay: 50 });
    await assertThrowsAsync(
      async () => await decorated(),
      Error,
      errorMsg,
    );
    assertEquals(callCount, 2);
  },
});

Deno.test({
  name: "decorator should throw an exception",
  fn: async () => {
    let callCount = 0;
    const errorMsg = "BOOM";
    const fn = () => {
      callCount++;
      throw new Error(errorMsg);
    };
    const decorated = retryDecorator(fn, { maxTry: 2, delay: 50 });
    await assertThrowsAsync(
      async () => await decorated(),
      Error,
      errorMsg,
    );
    assertEquals(callCount, 2);
  },
});

Deno.test({
  name: "Unitl: Decorator should returns the expected result",
  fn: async () => {
    const fn = (p1: string, p2: number) => {
      const promise = deferred<number>();
      promise.resolve(Number(p1) * p2);
      return promise;
    };
    const until = () => true;
    const decorated = retryAsyncDecorator(fn, { until });
    assertEquals(await decorated("10", 2), 20);
  },
});

Deno.test({
  name: "Unitl: Decorator should throw a TooManyTries error",
  fn: async () => {
    const fn = (p1: string, p2: number) => {
      const promise = deferred<number>();
      promise.resolve(Number(p1) * p2);
      return promise;
    };
    const until = () => false;
    const decorated = retryAsyncDecorator(fn, { until });
    try {
      await decorated("10", 2);
      throw new Error("Should have thrown an error");
    } catch (err) {
      assertEquals(isTooManyTries(err), true);
    }
  },
});
