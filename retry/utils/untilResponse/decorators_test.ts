import { assertEquals, assertThrowsAsync } from "../../../dev_deps.ts";
import { TooManyTries } from "../../tooManyTries.ts";
import { RetryUtilsOptions } from "../options.ts";
import { deferred } from "../../../deps.ts";
import { retryAsyncUntilResponseDecorator } from "./decorators.ts";

Deno.test({
  name: "retryAsyncUntilResponseDecorator: Should return immediatly",
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
    const decorated = await retryAsyncUntilResponseDecorator(f);
    const actualResult = await decorated();
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 1);
  },
});

Deno.test({
  name: "retryAsyncUntilResponseDecorator: Should return after first truthy result",
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
    const decorated = await retryAsyncUntilResponseDecorator(f);
    const actualResult = await decorated();
    assertEquals(actualResult, expectedResult);
    assertEquals(callCount, 3);
  },
});

Deno.test({
  name: "retryAsyncUntilResponseDecorator: Should throw a TooManyTries",
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
    const decorated = retryAsyncUntilResponseDecorator(f, { maxTry });
    await assertThrowsAsync(
      async () => await decorated(),
      TooManyTries,
    );
    assertEquals(callCount, maxTry);
  },
});

Deno.test({
  name: "retryAsyncUntilResponseDecorator: Should failed",
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
    const decorated = retryAsyncUntilResponseDecorator(f, retryOptions);
    await assertThrowsAsync(
      async () => await decorated(),
      Error,
      expectedErrorMsg,
    );
    assertEquals(callCount, retryOptions.maxTry);
  },
});

