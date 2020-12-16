import { retry, retryAsync } from "./mod.ts";
import {
  assertEquals,
  assertThrowsAsync,
  assert,
} from "./dev_deps.ts";

const defaultOptions = { maxTry: 5, delay: 250 };

const startAssetRetryDuration = (maxTry = defaultOptions.maxTry) => {
  const start = Date.now();
  const expectedDuration = (maxTry - 1) * defaultOptions.delay;
  return () => {
    const stop = Date.now();
    const actualDuration = stop - start;
    assert(
      actualDuration >= expectedDuration,
      `Duration ${actualDuration} is not greater or equal than expected minimum duration ${expectedDuration}`,
    );
  };
};

Deno.test("retry shouLd work immediatly", async () => {
  const expectedResult = 10103913232473;
  let callCount = 0;
  const cb = () => {
    callCount++;
    return expectedResult;
  };
  const actualResult = await retry(cb, defaultOptions);
  assertEquals(callCount, 1);
  assertEquals(actualResult, expectedResult);
});

Deno.test("retry shouLd be call until limit", async () => {
  const errorMsg = "BOOM";
  let callCount = 0;
  const cb = () => {
    callCount++;
    throw new Error(errorMsg);
  };
  const assertActualDuration = startAssetRetryDuration();
  await assertThrowsAsync(
    async () => await retry(cb, defaultOptions),
    Error,
    errorMsg,
  );
  assertActualDuration();
  assertEquals(callCount, 5);
});

Deno.test("retry shouLd be call until success", async () => {
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
  const assertActualDuration = startAssetRetryDuration(expectedCallCount);
  const actualResult = await retry(cb, defaultOptions);
  assertActualDuration();
  assertEquals(actualCallCount, expectedCallCount);
  assertEquals(actualResult, expectedResult);
});

Deno.test("retryAsync shouLd work immediatly", async () => {
  const expectedResult = 9856720325867;
  let callCount = 0;
  const cb = async () => {
    callCount++;
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(expectedResult),
        100,
      )
    );
  };
  const actualResult = await retryAsync(cb, defaultOptions);
  assertEquals(callCount, 1);
  assertEquals(actualResult, expectedResult);
});

Deno.test("retry shouLd be call until limit", async () => {
  const errorMsg = "BOOM";
  let callCount = 0;
  const cb = async () => {
    callCount++;
    return new Promise<void>((_, reject) => {
      setTimeout(
        () => reject(new Error(errorMsg)),
        100,
      );
    });
  };
  const assetRetryDuration = startAssetRetryDuration();
  await assertThrowsAsync(
    async () => await retryAsync(cb, defaultOptions),
    Error,
    errorMsg,
  );
  assetRetryDuration();
  assertEquals(callCount, 5);
});

Deno.test("retryAsync shouLd be call until success", async () => {
  const expectedResult = "youpi";
  const expectedCallCount = 4;
  let actualCallCount = 0;
  const cb = async () => {
    actualCallCount++;
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          if (actualCallCount < expectedCallCount) {
            return reject(new Error("Not yet"));
          }
          return resolve(expectedResult);
        },
        100,
      );
    });
  };
  const assetRetryDuration = startAssetRetryDuration(expectedCallCount);
  const actualResult = await retry(cb, defaultOptions);
  assetRetryDuration();
  assertEquals(actualCallCount, expectedCallCount);
  assertEquals(actualResult, expectedResult);
});
