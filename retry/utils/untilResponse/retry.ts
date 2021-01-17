// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { RetryUtilsOptions } from "../options.ts";
import { retry, retryAsync } from "../../retry.ts";

const until = <RETURN_TYPE extends Response>(
  lastResult: RETURN_TYPE,
): boolean => lastResult.ok;

export function retryUntilResponse<
  // deno-lint-ignore no-explicit-any
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE extends Response,
>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  return retry(fn, { ...retryOptions, until });
}

export function retryAsyncUntilResponse<
  // deno-lint-ignore no-explicit-any
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE extends Response,
>(
  fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  return retryAsync(fn, { ...retryOptions, until });
}
