// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { denoDelay } from "./deps.ts";
import { asyncDecorator } from "./misc.ts";

export class TimeoutError extends Error {
  isTimeout = true;
}

/** 
 * wait for a function to complete within a givne delay or throw an exception.
 *  
 * @param fn the async function to execute
 * @param delay timeout in milliseconds
 * @param [error] cumstion error to throw when fn duration exceeded delay. If not provided a TimeoutError is thrown.
 */
export async function waitUntilAsync<T>(
  fn: () => Promise<T>,
  delay: number,
  error: Error = new TimeoutError(
    "function did not complete within allowed time",
  ),
): Promise<T> {
  const canary = Symbol("RETRY_DELAY_EXPIRED");
  const result = await Promise.race([
    fn(),
    denoDelay(delay).then(() => canary),
  ]);
  if (result === canary) {
    throw error;
  }
  return result as T;
}

/** 
 * wait for a function to complete within a givne delay or throw an exception.
 *  
 * @param fn the function to execute
 * @param delay timeout in milliseconds
 * @param [error] cumstion error to throw when fn duration exceeded delay. If not provided a TimeoutError is thrown.
 */
export async function waitUntil<T>(
  fn: () => T,
  delay: number,
  error?: Error,
): Promise<T> {
  const fnAsync = asyncDecorator(fn);
  return await waitUntilAsync(fnAsync, delay, error);
}
