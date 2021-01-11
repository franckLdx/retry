// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { RetryUtilsOptions } from "./options.ts";
import { retry } from "../retry.ts";

export async function retryUntilTruthy<
  // deno-lint-ignore no-explicit-any
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE,
>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  // deno-lint-ignore no-explicit-any
  const until = (lastResult: RETURN_TYPE) => (lastResult as any) == true;
  return await retry(fn, { ...retryOptions, until });
}
