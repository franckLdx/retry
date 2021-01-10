import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { assertDefined } from "./misc.ts";

Deno.test({
  name: "Should not throw",
  fn: () => {
    assertDefined(1, "BOOM");
  },
});

Deno.test({
  name: "Should throw an error",
  fn: () => {
    const errMsg = "BOOM";
    try {
      assertDefined(null, errMsg);
    } catch (err) {
      assertEquals(err.message, errMsg);
    }
  },
});
