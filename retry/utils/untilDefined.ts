// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { RetryUtilsOptions } from "./options.ts";
import { retry, retryAsync } from "../retry.ts";

const until = <RETURN_TYPE>(
  lastResult: RETURN_TYPE | undefined | null,
): boolean => lastResult !== undefined && lastResult !== null;

export async function retryUntilDefined<RETURN_TYPE>(
  fn: () => RETURN_TYPE | undefined | null,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  const result = await retry(fn, { ...retryOptions, until });
  return result!;
}

export function retryUntilDefinedDecorator<
  // deno-lint-ignore no-explicit-any
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE,
>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE | undefined | null,
  retryOptions?: RetryUtilsOptions,
): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE> {
  return (
    ...args: PARAMETERS_TYPE
  ): Promise<RETURN_TYPE> => {
    const wrappedFn = () => fn(...args);
    return retryUntilDefined(wrappedFn, retryOptions);
  };
}

export async function retryAsyncUntilDefined<RETURN_TYPE>(
  fn: () => Promise<RETURN_TYPE | undefined | null>,
  options?: RetryUtilsOptions,
): Promise<RETURN_TYPE> {
  const result = await retryAsync(fn, { ...options, until });
  return result!;
}

export function retryAsyncUntilDefinedDecorator<
  // deno-lint-ignore no-explicit-any
  PARAMETERS_TYPE extends any[],
  RETURN_TYPE,
>(
  fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE | undefined | null>,
  retryOptions?: RetryUtilsOptions,
): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE> {
  return (
    ...args: PARAMETERS_TYPE
  ): Promise<RETURN_TYPE> => {
    const wrappedFn = () => fn(...args);
    return retryAsyncUntilDefined(wrappedFn, retryOptions);
  };
}
