// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { denoDelay } from "../deps.ts";
import { asyncDecorator } from "../misc.ts";
import { defaultRetryOptions, RetryOptions } from "./options.ts";

/** 
 * Retry a function until it does not throw an exception.
 *  
 * @param fn the function to execute
 * @param retryOptions retry options
 */
export function retry<T>(
  fn: () => T,
  retryOptions?: RetryOptions,
): Promise<T> {
  const fnAsync = asyncDecorator(fn);
  return retryAsync(fnAsync, retryOptions);
}

/** 
 * Retry an async function until it does not throw an exception.
 *  
 * @param fn the async function to execute
 * @param retryOptions retry options
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  { maxTry, delay }: RetryOptions = defaultRetryOptions,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (maxTry > 1) {
      await denoDelay(delay);
      return await retryAsync(fn, { delay: delay, maxTry: maxTry - 1 });
    }
    throw err;
  }
}
