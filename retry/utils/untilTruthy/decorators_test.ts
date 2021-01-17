// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import {
  retryAsyncUntilTruthyDecorator,
  retryUntilTruthyDecorator,
} from "./decorators.ts";
import { assertEquals, assertThrowsAsync } from "../../../dev_deps.ts";
import { TooManyTries } from "../../tooManyTries.ts";
import { RetryUtilsOptions } from "../options.ts";
import { deferred } from "../../../deps.ts";

// ----- Sync decorator
Deno.test({
  name: "retryUtilTruthyDecorator: Should return immediatly",
  fn: async () => {
    const expectedResult = 1;
    let callCount = 0;
    const f = () => {
      callCount++;
      return expectedResult;
    };
    const decorated = retryUntilTruthyDecorator(f);
    const actualResult = await decorated();
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 1);
  },
});

Deno.test({
  name: "retryUtilTruthyDecorator: Should return after first truthy result",
  fn: async () => {
    const expectedResult = true;
    let callCount = 0;
    const f = () => {
      callCount++;
      if (callCount === 1) {
        return undefined;
      } else if (callCount === 2) {
        return null;
      }
      return expectedResult;
    };
    const decorated = retryUntilTruthyDecorator(f);
    const actualResult = await decorated();
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 3);
  },
});

Deno.test({
  name: "retryUtilTruthyDecorator: Should throw a TooManyTries",
  fn: async () => {
    const maxTry = 4;
    let callCount = 0;
    const f = () => {
      callCount++;
      return callCount % 2 === 0 ? undefined : null;
    };
    const decorated = retryUntilTruthyDecorator(f, { maxTry });
    await assertThrowsAsync(
      async () => await decorated(),
      TooManyTries,
    );
    assertEquals(callCount, maxTry);
  },
});

Deno.test({
  name: "retryUtilTruthyDecorator: Should failed",
  fn: async () => {
    const expectedErrorMsg = "BOOM";
    const retryOptions: RetryUtilsOptions = {
      maxTry: 3,
      delay: 10,
    };
    let callCount = 0;
    const f = () => {
      callCount++;
      throw new Error(expectedErrorMsg);
    };
    const decorated = retryUntilTruthyDecorator(f, retryOptions);
    await assertThrowsAsync(
      () => decorated(),
      Error,
      expectedErrorMsg,
    );
    assertEquals(callCount, retryOptions.maxTry);
  },
});

// ---- Async decorator
Deno.test({
  name: "retryAsyncUtilTruthyDecorator: Should return immediatly",
  fn: async () => {
    const expectedResult = 1;
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<number>();
      setTimeout(() => p.resolve(expectedResult), 10);
      return p;
    };
    const decorated = retryAsyncUntilTruthyDecorator(f);
    const actualResult = await decorated();
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 1);
  },
});

Deno.test({
  name:
    "retryAsyncUtilTruthyDecorator: Should return after first truthy result",
  fn: async () => {
    const expectedResult = true;
    const expectedCallCount = 3;
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<boolean | null>();
      setTimeout(
        () => {
          if (callCount < expectedCallCount) {
            p.resolve(null);
          } else {
            p.resolve(expectedResult);
          }
        },
        10,
      );
      return p;
    };
    const decorated = retryAsyncUntilTruthyDecorator(f);
    const actualResult = await decorated();
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, expectedCallCount);
  },
});

Deno.test({
  name: "retryAsyncUtilTruthyDecorator: Should throw a TooManyTries",
  fn: async () => {
    const maxTry = 4;
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<boolean | undefined>();
      setTimeout(() => p.resolve(undefined), 10);
      return p;
    };
    const decorated = retryAsyncUntilTruthyDecorator(f, { maxTry });
    await assertThrowsAsync(
      async () => await decorated(),
      TooManyTries,
    );
    assertEquals(callCount, maxTry);
  },
});

Deno.test({
  name: "retryAsyncUtilTruthyDecorator: Should failed",
  fn: async () => {
    const expectedErrorMsg = "BOOM";
    const retryOptions: RetryUtilsOptions = {
      maxTry: 3,
      delay: 10,
    };
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<boolean | null>();
      setTimeout(() => p.reject(new Error(expectedErrorMsg)), 10);
      return p;
    };
    const decorated = retryAsyncUntilTruthyDecorator(f, retryOptions);
    await assertThrowsAsync(
      () => decorated(),
      Error,
      expectedErrorMsg,
    );
    assertEquals(callCount, retryOptions.maxTry);
  },
});
