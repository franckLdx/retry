// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { retryUntilTruthy, retryUntilTruthyDecorator } from "./untilTruthy.ts";
import { assertEquals, assertThrowsAsync } from "../../dev_deps.ts";
import { TooManyTries } from "../tooManyTries.ts";
import { RetryUtilsOptions } from "./options.ts";

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
