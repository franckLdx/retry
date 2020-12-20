import { deferred } from "../deps.ts";
import { assert, assertEquals, assertThrowsAsync } from "../dev_deps.ts";
import { retry, retryAsync } from "./retry.ts";
import { setDefaultRetryOptions } from "./options.ts";
import type { RetryOptions } from "./options.ts";

const defaultRetryOptions = setDefaultRetryOptions({ maxTry: 5, delay: 250 });

const startAssetRetryDuration = (
  { maxTry, delay }: RetryOptions = defaultRetryOptions,
) => {
  const start = Date.now();
  const expectedDuration = (maxTry - 1) * delay;
  return () => {
    const stop = Date.now();
    const actualDuration = stop - start;
    assert(
      actualDuration >= expectedDuration,
      `Duration ${actualDuration} is not greater or equal than expected minimum duration ${expectedDuration}`,
    );
  };
};

Deno.test({
  name: "retry shouLd work immediatly",
  fn: async () => {
    const expectedResult = 10103913232473;
    let callCount = 0;
    const cb = () => {
      callCount++;
      return expectedResult;
    };
    const actualResult = await retry(cb);
    assertEquals(callCount, 1);
    assertEquals(actualResult, expectedResult);
  },
});

Deno.test({
  name: "retry shouLd be call until limit",
  fn: async () => {
    const errorMsg = "BOOM";
    let callCount = 0;
    const cb = () => {
      callCount++;
      throw new Error(errorMsg);
    };
    const assertActualDuration = startAssetRetryDuration();
    await assertThrowsAsync(
      async () => await retry(cb),
      Error,
      errorMsg,
    );
    assertActualDuration();
    assertEquals(callCount, 5);
  },
});

Deno.test({
  name: "retry shouLd be call until custom limit",
  fn: async () => {
    const retryOptions: RetryOptions = {
      maxTry: 5,
      delay: 10,
    };
    const errorMsg = "BOOM";
    let callCount = 0;
    const cb = () => {
      callCount++;
      throw new Error(errorMsg);
    };
    const assertActualDuration = startAssetRetryDuration(retryOptions);
    await assertThrowsAsync(
      async () => await retry(cb),
      Error,
      errorMsg,
    );
    assertActualDuration();
    assertEquals(callCount, 5);
  },
});

Deno.test({
  name: "retry shouLd be call until success",
  fn: async () => {
    const expectedResult = "youpi";
    const expectedCallCount = 4;
    let actualCallCount = 0;
    const cb = () => {
      actualCallCount++;
      if (actualCallCount < expectedCallCount) {
        throw new Error("Not yet");
      }
      return expectedResult;
    };
    const assertActualDuration = startAssetRetryDuration(
      { ...defaultRetryOptions, maxTry: expectedCallCount },
    );
    const actualResult = await retry(cb);
    assertActualDuration();
    assertEquals(actualCallCount, expectedCallCount);
    assertEquals(actualResult, expectedResult);
  },
});

Deno.test({
  name: "retryAsync shouLd work immediatly",
  fn: async () => {
    const expectedResult = 9856720325867;
    let callCount = 0;
    const cb = () => {
      callCount++;
      return new Promise((resolve) =>
        setTimeout(
          () => resolve(expectedResult),
          100,
        )
      );
    };
    const actualResult = await retryAsync(cb);
    assertEquals(callCount, 1);
    assertEquals(actualResult, expectedResult);
  },
});

Deno.test({
  name: "retry shouLd be call until limit",
  fn: async () => {
    const errorMsg = "BOOM";
    let callCount = 0;
    const cb = () => {
      callCount++;
      const promise = deferred();
      setTimeout(
        () => promise.reject(new Error(errorMsg)),
        100,
      );
      return promise;
    };
    const assetRetryDuration = startAssetRetryDuration();
    await assertThrowsAsync(
      async () => await retryAsync(cb),
      Error,
      errorMsg,
    );
    assetRetryDuration();
    assertEquals(callCount, 5);
  },
});

Deno.test({
  name: "retryAsync shouLd be call until success",
  fn: async () => {
    const expectedResult = "youpi";
    const expectedCallCount = 4;
    let actualCallCount = 0;
    const cb = () => {
      actualCallCount++;
      const promise = deferred();
      setTimeout(
        () => {
          if (actualCallCount < expectedCallCount) {
            promise.reject(new Error("Not yet"));
          }
          promise.resolve(expectedResult);
        },
        100,
      );
      return promise;
    };
    const assetRetryDuration = startAssetRetryDuration(
      { ...defaultRetryOptions, maxTry: expectedCallCount },
    );
    const actualResult = await retry(cb);
    assetRetryDuration();
    assertEquals(actualCallCount, expectedCallCount);
    assertEquals(actualResult, expectedResult);
  },
});
