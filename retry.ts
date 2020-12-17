// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { denoDelay } from "./deps.ts";
import { asyncDecorator } from "./misc.ts";

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
  { maxTry, delay }: RetryOptions = defaulRetryOptions,
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

/** 
 * Retry options:
 *  - maxTry: maximum number of attempts. if fn is still throwing execption afect maxtry attempts, an exepction is thrown 
 *  - delay: number of miliseconds between each attempt.
 */
export interface RetryOptions {
  maxTry: number; // maximum number of attempts. if fn is still throwing execption afect maxtry attempts, an exepction is thrown
  delay: number; // number of miliseconds between each attempt.
}

let defaulRetryOptions: RetryOptions = {
  delay: 250,
  maxTry: 250 * 4 * 60,
};

/** Set default retry options */
export function setDefaulRetryOptions(
  retryOptions: Partial<RetryOptions>,
): RetryOptions {
  defaulRetryOptions = { ...defaulRetryOptions, ...retryOptions };
  return getDefaulRetryOptions();
}

/** Returns the current retry options. To change default options, use setDefaulRetryOptions: do not try to modify this object */
export function getDefaulRetryOptions(): Readonly<RetryOptions> {
  return { ...defaulRetryOptions };
}
