// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { deno_delay } from "./deps.ts";

export class TimeoutError extends Error {
  isTimeout = true;
}

const canary = Symbol("RETRY_DELAY_EXPIRED");

export async function waitUntil<T>(
  fn: () => Promise<T>,
  delay: number,
  error?: Error,
): Promise<T> {
  const result = await Promise.race([
    fn(),
    deno_delay(delay).then(() => canary),
  ]);
  if (result === canary) {
    if (error) {
      throw error;
    } else {
      throw new TimeoutError("function did not complete within allowed time");
    }
  }
  return result as T;
}
