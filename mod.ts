// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { deno_delay, deferred } from "./deps.ts";

/** 
 * Retry a function until it does not throw an exception.
 *  
 * @param fn the function to execute
 * @param retryOptions retry options
 */
export async function retry<T>(
  fn: () => T,
  retryOptions: RetryOptions,
): Promise<T> {
  const wrapped = (): Promise<T> => {
    const promise = deferred<T>();
    try {
      const result = fn();
      promise.resolve(result);
    } catch (err) {
      promise.reject(err);
    }
    return promise;
  }
  return retryAsync(wrapped, retryOptions);
}

/** 
 * Retry an async function until it does not throw an exception.
 *  
 * @param fn the async function to execute
 * @param retryOptions retry options
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  { maxTry, delay }: RetryOptions,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (maxTry > 1) {
      await deno_delay(delay);
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
  delay: number; //number of miliseconds between each attempt.
}
