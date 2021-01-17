// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import {
  retryAsyncUntilDefinedDecorator,
  retryUntilDefinedDecorator,
} from "./decorators.ts";
import {
  assertEquals,
  assertThrowsAsync,
  deferred,
} from "../../../dev_deps.ts";
import { TooManyTries } from "../../tooManyTries.ts";
import { RetryUtilsOptions } from "../options.ts";

// ----- Decorator Sync
Deno.test({
  name: "retryUtilDecorator: Should return immediatly",
  fn: async () => {
    const expectedResult = "hello";
    let callCount = 0;
    const f = () => {
      callCount++;
      return expectedResult;
    };
    const decorated = retryUntilDefinedDecorator(f);
    const actualResult = await decorated();
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 1);
  },
});

Deno.test({
  name: "retryUtilDecorator: Should return after first defined result",
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
    const decorated = retryUntilDefinedDecorator(f);
    const actualResult = await decorated();
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 3);
  },
});

Deno.test({
  name: "retryUtilDecorator: Should throw a TooManyTries",
  fn: async () => {
    const maxTry = 4;
    let callCount = 0;
    const f = () => {
      callCount++;
      return callCount % 2 === 0 ? undefined : null;
    };
    const decorated = retryUntilDefinedDecorator(
      f,
      { maxTry },
    );
    await assertThrowsAsync(
      decorated,
      TooManyTries,
    );
    assertEquals(callCount, maxTry);
  },
});

Deno.test({
  name: "retryUtilDecorator: Should failed",
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
    const decorated = retryUntilDefinedDecorator(f, retryOptions);
    await assertThrowsAsync(
      decorated,
      Error,
      expectedErrorMsg,
    );
    assertEquals(callCount, retryOptions.maxTry);
  },
});

// ----- Decorator ASync
Deno.test({
  name: "retryUtilDecorator: Should return immediatly",
  fn: async () => {
    const expectedResult = "hello";
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<string>();
      setTimeout(
        () => p.resolve(expectedResult),
        10,
      );
      return p;
    };
    const decorated = retryAsyncUntilDefinedDecorator(f);
    const actualResult = await decorated();
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 1);
  },
});

Deno.test({
  name: "retryUtilDecorator: Should return after first defined result",
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
        10,
      );
      return p;
    };
    const decorated = retryAsyncUntilDefinedDecorator(f);
    const actualResult = await decorated();
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 3);
  },
});

Deno.test({
  name: "retryUtilDecorator: Should throw a TooManyTries",
  fn: async () => {
    const maxTry = 4;
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<undefined | null>();
      setTimeout(
        () => {
          if (callCount % 2 === 0) {
            p.resolve(undefined);
          } else {
            p.resolve(null);
          }
        },
        10,
      );
      return p;
    };
    const decorated = retryUntilDefinedDecorator(
      f,
      { maxTry },
    );
    await assertThrowsAsync(
      decorated,
      TooManyTries,
    );
    assertEquals(callCount, maxTry);
  },
});

Deno.test({
  name: "retryUtilDecorator: Should failed",
  fn: async () => {
    const expectedErrorMsg = "BOOM";
    const retryOptions: RetryUtilsOptions = {
      maxTry: 3,
      delay: 10,
    };
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred();
      setTimeout(
        () => p.reject(new Error(expectedErrorMsg)),
        10,
      );
      return p;
    };
    const decorated = retryUntilDefinedDecorator(f, retryOptions);
    await assertThrowsAsync(
      decorated,
      Error,
      expectedErrorMsg,
    );
    assertEquals(callCount, retryOptions.maxTry);
  },
});
