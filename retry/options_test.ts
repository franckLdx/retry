// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { getDefaultRetryOptions, setDefaultRetryOptions } from "./options.ts";
import type { RetryOptions } from "./options.ts";
import { assertEquals } from "../dev_deps.ts";

Deno.test({
  name: "defaultOptions can be changed",
  fn: () => {
    const initialOptions = getDefaultRetryOptions();
    try {
      const expectedOptions: RetryOptions<void> = {
        maxTry: 10,
        delay: 10,
        until: null,
      };
      const defaultOptions = setDefaultRetryOptions(expectedOptions);
      assertEquals(defaultOptions, expectedOptions);
      assertEquals(getDefaultRetryOptions(), expectedOptions);
    } finally {
      setDefaultRetryOptions(initialOptions);
    }
  },
});

Deno.test({
  name: "defaultOptions: maxTry can be changed",
  fn: () => {
    const initialOptions = getDefaultRetryOptions();
    try {
      const newMaxTry = initialOptions.maxTry! * 2;
      const expectedOptions = { ...initialOptions, maxTry: newMaxTry };
      const defaultOptions = setDefaultRetryOptions({ maxTry: newMaxTry });
      assertEquals(defaultOptions, expectedOptions);
      assertEquals(getDefaultRetryOptions(), expectedOptions);
    } finally {
      setDefaultRetryOptions(initialOptions);
    }
  },
});

Deno.test({
  name: "defaultOptions: delay can be changed",
  fn: () => {
    const initialOptions = getDefaultRetryOptions();
    try {
      const newdelay = initialOptions.delay! * 2;
      const expectedOptions = { ...initialOptions, delay: newdelay };
      const defaultOptions = setDefaultRetryOptions({ delay: newdelay });
      assertEquals(defaultOptions, expectedOptions);
      assertEquals(getDefaultRetryOptions(), expectedOptions);
    } finally {
      setDefaultRetryOptions(initialOptions);
    }
  },
});
