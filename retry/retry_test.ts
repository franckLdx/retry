import { deferred } from "../deps.ts";
import { assert, assertEquals, assertThrowsAsync } from "../dev_deps.ts";
import { retry, retryAsync } from "./retry.ts";
import { setDefaultRetryOptions } from "./options.ts";
import type { RetryOptions } from "./options.ts";
import { isTooManyTries } from "./tooManyTries.ts";
import { retryAsyncDecorator } from "./decorator.ts";

const defaultRetryOptions = setDefaultRetryOptions({ maxTry: 5, delay: 250 });

const startAssetRetryDuration = (
  { maxTry, delay }: RetryOptions<void> = defaultRetryOptions,
) => {
  const start = Date.now();
  const expectedDuration = (maxTry! - 1) * delay!;
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
    const retryOptions: RetryOptions<void> = {
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

Deno.test({
  name: "Retry with until: Returns immediatly when until is ok",
  fn: async () => {
    const expectedResult = 10103913232473;
    let cbCallCount = 0;
    const cb = () => {
      cbCallCount++;
      return expectedResult;
    };
    let untilCallCount = 0;
    const until = (lastResult: number) => {
      untilCallCount++;
      return lastResult === expectedResult;
    };
    const actualResult = await retry(cb, { until });
    assertEquals(cbCallCount, 1, "cb called too many times");
    assertEquals(untilCallCount, 1, "until called too many times");
    assertEquals(actualResult, expectedResult);
  },
});

Deno.test({
  name: "Retry with until: result is always rejected by until",
  fn: async () => {
    const expectedResult = 10103913232473;
    const maxTry = 3;
    let cbCallCount = 0;
    const cb = () => {
      cbCallCount++;
      return expectedResult;
    };
    let untilCallCount = 0;
    const until = (lastResult: number) => {
      untilCallCount++;
      return lastResult !== expectedResult;
    };
    try {
      await retry(cb, { maxTry, until });
      throw new Error("Should have thrown an exception");
    } catch (err) {
      assertEquals(isTooManyTries(err), true);
    }
    assertEquals(cbCallCount, maxTry, "cb called too many times");
    assertEquals(untilCallCount, maxTry, "until called too many times");
  },
});

Deno.test({
  name: "Retry with until: cb si recal until  'until' returns true",
  fn: async () => {
    const expectedResult = 10103913232473;
    const expectedCallCount = 2;
    let cbCallCount = 0;
    const cb = () => {
      cbCallCount++;
      return expectedResult;
    };
    let untilCallCount = 0;
    const until = (lastResult: number) => {
      untilCallCount++;
      return lastResult === expectedResult &&
        untilCallCount == expectedCallCount;
    };
    const actualResult = await retry(cb, { until });
    assertEquals(cbCallCount, expectedCallCount, "cb wonrg call count");
    assertEquals(untilCallCount, expectedCallCount, "until wonrg call count");
    assertEquals(actualResult, expectedResult);
  },
});
