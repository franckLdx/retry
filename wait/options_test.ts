import { getDefaultDuration, setDefaultDuration } from "./mod.ts";
import { assertEquals } from "../dev_deps.ts";

Deno.test("default duration can be changed", () => {
  const initialDuration = getDefaultDuration();
  try {
    const expectedDuration = initialDuration + 100;
    setDefaultDuration(expectedDuration);
    assertEquals(getDefaultDuration(), expectedDuration);
  } finally {
    setDefaultDuration(initialDuration);
  }
});
