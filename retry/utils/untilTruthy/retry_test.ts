// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { retryAsyncUntilTruthy, retryUntilTruthy } from "./retry.ts";
import { assertEquals, assertThrowsAsync } from "../../../dev_deps.ts";
import { TooManyTries } from "../../tooManyTries.ts";
import { RetryUtilsOptions } from "../options.ts";
import { deferred } from "../../../deps.ts";

// ----- Sync
Deno.test({
  name: "retryUtilTruthy: Should return immediatly",
  fn: async () => {
    const expectedResult = 1;
    let callCount = 0;
    const f = () => {
      callCount++;
      return expectedResult;
    };
    const actualResult = await retryUntilTruthy(f);
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 1);
  },
});

Deno.test({
  name: "retryUtilTruthy: Should return after first truthy result",
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
    const actualResult = await retryUntilTruthy(f);
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 3);
  },
});

Deno.test({
  name: "retryUtilTruthy: Should throw a TooManyTries",
  fn: async () => {
    const maxTry = 4;
    let callCount = 0;
    const f = () => {
      callCount++;
      return callCount % 2 === 0 ? undefined : null;
    };
    await assertThrowsAsync(
      async () => await retryUntilTruthy(f, { maxTry }),
      TooManyTries,
    );
    assertEquals(callCount, maxTry);
  },
});

Deno.test({
  name: "retryUtilTruthy: Should failed",
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
    await assertThrowsAsync(
      () => retryUntilTruthy(f, retryOptions),
      Error,
      expectedErrorMsg,
    );
    assertEquals(callCount, retryOptions.maxTry);
  },
});

// ----- Async
Deno.test({
  name: "retryUtilTruthyAsync: Should return immediatly",
  fn: async () => {
    const expectedResult = 1;
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<number>();
      setTimeout(() => p.resolve(expectedResult), 100);
      return p;
    };
    const actualResult = await retryAsyncUntilTruthy(f);
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 1);
  },
});

Deno.test({
  name: "retryUtilTruthyAsync: Should return after first truthy result",
  fn: async () => {
    const expectedResult = true;
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<boolean>();
      setTimeout(
        () => {
          if (callCount <= 2) {
            p.resolve(false);
          } else {
            p.resolve(true);
          }
        },
        100,
      );
      return p;
    };
    const actualResult = await retryAsyncUntilTruthy(f);
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 3);
  },
});

Deno.test({
  name: "retryUtilTruthyAsync: Should throw a TooManyTries",
  fn: async () => {
    const maxTry = 4;
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<boolean>();
      setTimeout(
        () => p.resolve(false),
        10,
      );
      return p;
    };
    await assertThrowsAsync(
      async () => await retryAsyncUntilTruthy(f, { maxTry }),
      TooManyTries,
    );
    assertEquals(callCount, maxTry);
  },
});

Deno.test({
  name: "retryUtilTruthyAsync: Should failed",
  fn: async () => {
    const expectedErrorMsg = "BOOM";
    const retryOptions: RetryUtilsOptions = {
      maxTry: 3,
      delay: 10,
    };
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<string>();
      setTimeout(() => p.reject(new Error(expectedErrorMsg)), 10);
      return p;
    };
    await assertThrowsAsync(
      () => retryUntilTruthy(f, retryOptions),
      Error,
      expectedErrorMsg,
    );
    assertEquals(callCount, retryOptions.maxTry);
  },
});
