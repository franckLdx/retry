import {
  getDefaulRetryOptions,
  retry,
  retryAsync,
  RetryOptions,
  setDefaulRetryOptions,
} from "./mod.ts";
import { assert, assertEquals, assertThrowsAsync } from "./dev_deps.ts";

const defaultRetryOptions = setDefaulRetryOptions({ maxTry: 5, delay: 250 });

Deno.test("defaultOptions can be changed", async () => {
  const initialOptions = getDefaulRetryOptions();
  try {
    const refOptions: RetryOptions = { maxTry: 10, delay: 10 };
    const defaultOptions = setDefaulRetryOptions(refOptions);
    assertEquals(defaultOptions, refOptions);
    assertEquals(getDefaulRetryOptions(), refOptions);
  } finally {
    setDefaulRetryOptions(initialOptions);
  }
});

Deno.test("defaultOptions: maxTry can be changed", async () => {
  const initialOptions = getDefaulRetryOptions();
  try {
    const newMaxTry = initialOptions.maxTry * 2;
    const expectedOptions = { ...initialOptions, maxTry: newMaxTry };
    const defaultOptions = setDefaulRetryOptions({ maxTry: newMaxTry });
    assertEquals(defaultOptions, expectedOptions);
    assertEquals(getDefaulRetryOptions(), expectedOptions);
  } finally {
    setDefaulRetryOptions(initialOptions);
  }
});

Deno.test("defaultOptions: delay can be changed", async () => {
  const initialOptions = getDefaulRetryOptions();
  try {
    const newdelay = initialOptions.delay * 2;
    const expectedOptions = { ...initialOptions, delay: newdelay };
    const defaultOptions = setDefaulRetryOptions({ delay: newdelay });
    assertEquals(defaultOptions, expectedOptions);
    assertEquals(getDefaulRetryOptions(), expectedOptions);
  } finally {
    setDefaulRetryOptions(initialOptions);
  }
});

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

Deno.test("retry shouLd work immediatly", async () => {
  const expectedResult = 10103913232473;
  let callCount = 0;
  const cb = () => {
    callCount++;
    return expectedResult;
  };
  const actualResult = await retry(cb);
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
    async () => await retry(cb),
    Error,
    errorMsg,
  );
  assertActualDuration();
  assertEquals(callCount, 5);
});

Deno.test("retry shouLd be call until custom limit", async () => {
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
  const assertActualDuration = startAssetRetryDuration(
    { ...defaultRetryOptions, maxTry: expectedCallCount },
  );
  const actualResult = await retry(cb);
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
  const actualResult = await retryAsync(cb);
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
    async () => await retryAsync(cb),
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
  const assetRetryDuration = startAssetRetryDuration(
    { ...defaultRetryOptions, maxTry: expectedCallCount },
  );
  const actualResult = await retry(cb);
  assetRetryDuration();
  assertEquals(actualCallCount, expectedCallCount);
  assertEquals(actualResult, expectedResult);
});
