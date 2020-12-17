import {
  getDefaultRetryOptions,
  RetryOptions,
  setDefaultRetryOptions,
} from "./mod.ts";
import { assertEquals } from "../dev_deps.ts";

Deno.test("defaultOptions can be changed", async () => {
  const initialOptions = getDefaultRetryOptions();
  try {
    const refOptions: RetryOptions = { maxTry: 10, delay: 10 };
    const defaultOptions = setDefaultRetryOptions(refOptions);
    assertEquals(defaultOptions, refOptions);
    assertEquals(getDefaultRetryOptions(), refOptions);
  } finally {
    setDefaultRetryOptions(initialOptions);
  }
});

Deno.test("defaultOptions: maxTry can be changed", async () => {
  const initialOptions = getDefaultRetryOptions();
  try {
    const newMaxTry = initialOptions.maxTry * 2;
    const expectedOptions = { ...initialOptions, maxTry: newMaxTry };
    const defaultOptions = setDefaultRetryOptions({ maxTry: newMaxTry });
    assertEquals(defaultOptions, expectedOptions);
    assertEquals(getDefaultRetryOptions(), expectedOptions);
  } finally {
    setDefaultRetryOptions(initialOptions);
  }
});

Deno.test("defaultOptions: delay can be changed", async () => {
  const initialOptions = getDefaultRetryOptions();
  try {
    const newdelay = initialOptions.delay * 2;
    const expectedOptions = { ...initialOptions, delay: newdelay };
    const defaultOptions = setDefaultRetryOptions({ delay: newdelay });
    assertEquals(defaultOptions, expectedOptions);
    assertEquals(getDefaultRetryOptions(), expectedOptions);
  } finally {
    setDefaultRetryOptions(initialOptions);
  }
});
