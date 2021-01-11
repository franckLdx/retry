// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { RetryUtilsOptions } from "./options.ts";
import { retry } from "../retry.ts";

const until = <RETURN_TYPE>(lastResult: RETURN_TYPE): boolean =>
  // deno-lint-ignore no-explicit-any
  (lastResult as any) == true;

export async function retryUntilTruthy<
  // deno-lint-ignore no-explicit-any
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE,
>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  return await retry(fn, { ...retryOptions, until });
}

export function retryUntilTruthyDecorator<
  // deno-lint-ignore no-explicit-any
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE,
>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE,
  retryOptions?: RetryUtilsOptions,
): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE> {
  return (...args: PARAMETERS_TYPE): Promise<RETURN_TYPE> => {
    const wrappedFn = () => fn(...args);
    return retryUntilTruthy(wrappedFn, retryOptions);
  };
}
