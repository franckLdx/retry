import { getDefaultDuration, setDefaultDuration } from "./mod.ts";
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
