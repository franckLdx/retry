// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { assertEquals } from "../dev_deps.ts";
import { isTooManyTries, TooManyTries } from "./tooManyTries.ts";

Deno.test({
  name: "Should return false when error is not a ToManyTries",
  fn: () => {
    const error = new Error("BOOM");
    assertEquals(isTooManyTries(error), false);
  },
});

Deno.test({
  name: "Should return true when error is a ToManyTries",
  fn: () => {
    const error = new TooManyTries();
    assertEquals(isTooManyTries(error), true);
  },
});
