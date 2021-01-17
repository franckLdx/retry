// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { assertEquals, assertThrowsAsync } from "../../../dev_deps.ts";
import { TooManyTries } from "../../tooManyTries.ts";
import { RetryUtilsOptions } from "../options.ts";
import { deferred } from "../../../deps.ts";
import { retryAsyncUntilResponse, retryUntilResponse } from "./retry.ts";

// ----- Sync
Deno.test({
  name: "retryUntilResponse: Should return immediatly",
  only: false,
  fn: async () => {
    const expectedResult = new Response();
    let callCount = 0;
    const f = () => {
      callCount++;
      return expectedResult;
    };
    const actualResult = await retryUntilResponse(f);
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 1);
  },
});

Deno.test({
  name: "retryUntilResponse: Should return after first truthy result",
  only: false,
  fn: async () => {
    const expectedResult = new Response();
    let callCount = 0;
    const f = () => {
      callCount++;
      if (callCount <= 2) {
        return Response.error();
      } else {
        return expectedResult;
      }
    };
    const actualResult = await retryUntilResponse(f);
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 3);
  },
});

Deno.test({
  name: "retryUntilResponse: Should throw a TooManyTries",
  only: false,
  fn: async () => {
    const maxTry = 4;
    let callCount = 0;
    const f = () => {
      callCount++;
      return { ok: false } as Response;
    };
    await assertThrowsAsync(
      async () => await retryUntilResponse(f, { maxTry }),
      TooManyTries,
    );
    assertEquals(callCount, maxTry);
  },
});

Deno.test({
  name: "retryUntilResponse: Should failed",
  only: false,
  fn: async () => {
    const expectedErrorMsg = "BOOM";
    const retryOptions: RetryUtilsOptions = {
      maxTry: 3,
      delay: 10,
    };
    let callCount = 0;
    const f = (): Response => {
      callCount++;
      throw new Error(expectedErrorMsg);
    };
    await assertThrowsAsync(
      () => retryUntilResponse(f, retryOptions),
      Error,
      expectedErrorMsg,
    );
    assertEquals(callCount, retryOptions.maxTry);
  },
});

// ----- Async
Deno.test({
  name: "retryAsyncUntilResponse: Should return immediatly",
  only: false,
  fn: async () => {
    const expectedResult = new Response("yes");
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<Response>();
      setTimeout(() => p.resolve(expectedResult), 100);
      return p;
    };
    const actualResult = await retryAsyncUntilResponse(f);
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 1);
  },
});

Deno.test({
  name: "retryAsyncUntilResponse: Should return after first truthy result",
  only: false,
  fn: async () => {
    const expectedResult = new Response();
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<Response>();
      setTimeout(
        () => {
          if (callCount <= 2) {
            p.resolve({ ok: false } as Response);
          } else {
            p.resolve(expectedResult);
          }
        },
        100,
      );
      return p;
    };
    const actualResult = await retryAsyncUntilResponse(f);
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 3);
  },
});

Deno.test({
  name: "retryAsyncUntilResponse: Should throw a TooManyTries",
  only: false,
  fn: async () => {
    const maxTry = 4;
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<Response>();
      setTimeout(
        () => p.resolve({ ok: false } as Response),
        10,
      );
      return p;
    };
    await assertThrowsAsync(
      async () => await retryAsyncUntilResponse(f, { maxTry }),
      TooManyTries,
    );
    assertEquals(callCount, maxTry);
  },
});

Deno.test({
  name: "retryAsyncUntilResponse: Should failed",
  only: false,
  fn: async () => {
    const expectedErrorMsg = "BOOM";
    const retryOptions: RetryUtilsOptions = {
      maxTry: 3,
      delay: 10,
    };
    let callCount = 0;
    const f = () => {
      callCount++;
      const p = deferred<Response>();
      setTimeout(() => p.reject(new Error(expectedErrorMsg)), 10);
      return p;
    };
    await assertThrowsAsync(
      () => retryAsyncUntilResponse(f, retryOptions),
      Error,
      expectedErrorMsg,
    );
    assertEquals(callCount, retryOptions.maxTry);
  },
});
