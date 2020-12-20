// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { denoDelay } from "../deps.ts";
import { asyncDecorator } from "../misc.ts";
import { defaultDuration } from "./options.ts";

export class TimeoutError extends Error {
  isTimeout = true;
}

/** Type guard for TimeoutError */
export function isTimeoutError(error: Error): error is TimeoutError {
  return (error as TimeoutError).isTimeout === true;
}

/** 
 * wait for a function to complete within a givne duration or throw an exception.
 *  
 * @param fn the async function to execute
 * @param duration timeout in milliseconds
 * @param [error] custom error to throw when fn duration exceeded duration. If not provided a TimeoutError is thrown.
 */
export async function waitUntilAsync<T>(
  fn: () => Promise<T>,
  duration: number = defaultDuration,
  error: Error = new TimeoutError(
    "function did not complete within allowed time",
  ),
): Promise<T> {
  const canary = Symbol("RETRY_LIB_FN_EXPIRED");
  const result = await Promise.race([
    fn(),
    denoDelay(duration).then(() => canary),
  ]);
  if (result === canary) {
    throw error;
  }
  return result as T;
}

/** 
 * wait for a function to complete within a givne duration or throw an exception.
 *  
 * @param fn the function to execute
 * @param duration timeout in milliseconds
 * @param [error] custom error to throw when fn duration exceeded duration. If not provided a TimeoutError is thrown.
 */
export async function waitUntil<T>(
  fn: () => T,
  duration?: number,
  error?: Error,
): Promise<T> {
  const fnAsync = asyncDecorator(fn);
  return await waitUntilAsync(fnAsync, duration, error);
}
