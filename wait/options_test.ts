// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { getDefaultDuration, setDefaultDuration } from "./options.ts";
import { assertEquals } from "../dev_deps.ts";

Deno.test({
  name: "default duration can be changed",
  fn: () => {
    const initialDuration = getDefaultDuration();
    try {
      const expectedDuration = initialDuration + 100;
      setDefaultDuration(expectedDuration);
      assertEquals(getDefaultDuration(), expectedDuration);
    } finally {
      setDefaultDuration(initialDuration);
    }
  },
});
