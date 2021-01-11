// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { assertEquals } from "../dev_deps.ts";
import { isTimeoutError, TimeoutError } from "./timeoutError.ts";

Deno.test({
  name: "Should return false when error is not a TimeoutError",
  fn: () => {
    const error = new Error("BOOM");
    assertEquals(isTimeoutError(error), false);
  },
});

Deno.test({
  name: "Should return true when error is a TimeoutError",
  fn: () => {
    const error = new TimeoutError();
    assertEquals(isTimeoutError(error), true);
  },
});
