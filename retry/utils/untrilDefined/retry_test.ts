// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { retryAsyncUntilDefined, retryUntilDefined } from "./retry.ts";
import {
  assertEquals,
  assertThrowsAsync,
  deferred,
} from "../../../dev_deps.ts";
import { TooManyTries } from "../../tooManyTries.ts";
import { RetryUtilsOptions } from "../options.ts";

// ----- Sync

Deno.test({
  name: "retryUtil: Should return immediatly",
  fn: async () => {
    const expectedResult = "hello";
    let callCount = 0;
    const f = () => {
      callCount++;
      return expectedResult;
    };
    const actualResult = await retryUntilDefined(f);
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 1);
  },
});

Deno.test({
  name: "retryUtil: Should return after first defined result",
  fn: async () => {
    const expectedResult = "hello";
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
    const actualResult = await retryUntilDefined(f);
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 3);
  },
});

Deno.test({
  name: "retryUtil: Should throw a TooManyTries",
  fn: async () => {
    const maxTry = 4;
    let callCount = 0;
    const f = () => {
      callCount++;
      return callCount % 2 === 0 ? undefined : null;
    };
    await assertThrowsAsync(
      async () => await retryUntilDefined(f, { maxTry }),
      TooManyTries,
    );
    assertEquals(callCount, maxTry);
  },
});

Deno.test({
  name: "retryUtil: Should failed",
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
      () => retryUntilDefined(f, retryOptions),
      Error,
      expectedErrorMsg,
    );
    assertEquals(callCount, retryOptions.maxTry);
  },
});

// --- Async
Deno.test({
  name: "retryAsyncUtil: Should return immediatly",
  fn: async () => {
    const expectedResult = "hello";
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<string>();
      setTimeout(() => p.resolve(expectedResult), 100);
      return p;
    };
    const actualResult = await retryAsyncUntilDefined(f);
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 1);
  },
});

Deno.test({
  name: "retryAsyncUtil: Should return after first defined result",
  fn: async () => {
    const expectedResult = "hello";
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<string | null | undefined>();
      setTimeout(
        () => {
          if (callCount === 1) {
            p.resolve(undefined);
          } else if (callCount === 2) {
            p.resolve(null);
          } else {
            p.resolve(expectedResult);
          }
        },
        100,
      );
      return p;
    };
    const actualResult = await retryAsyncUntilDefined(f);
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 3);
  },
});

Deno.test({
  name: "retryAsyncUtil: Should throw a TooManyTries",
  fn: async () => {
    const maxTry = 4;
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<undefined | null>();
      setTimeout(
        () => callCount % 2 === 0 ? p.resolve(undefined) : p.resolve(null),
        10,
      );
      return p;
    };
    await assertThrowsAsync(
      async () => await retryAsyncUntilDefined(f, { maxTry }),
      TooManyTries,
    );
    assertEquals(callCount, maxTry);
  },
});

Deno.test({
  name: "retryAsyncUtil: Should failed",
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
      () => retryAsyncUntilDefined(f, retryOptions),
      Error,
      expectedErrorMsg,
    );
    assertEquals(callCount, retryOptions.maxTry);
  },
});
