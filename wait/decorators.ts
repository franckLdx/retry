import { waitUntil, waitUntilAsync } from "./wait.ts";

export function waitUntilAsyncDecorator<
  // deno-lint-ignore no-explicit-any
  T extends (...args: any[]) => Promise<any>,
>(fn: T, duration?: number, error?: Error) {
  return (...args: Parameters<T>): ReturnType<T> => {
    const wrappedFn = () => fn(...args);
    return waitUntilAsync(wrappedFn, duration, error) as ReturnType<T>;
  };
}

export function waitUntilDecorator<
  // deno-lint-ignore no-explicit-any
  T extends (...args: any[]) => any,
>(fn: T, duration?: number, error?: Error) {
  return (...args: Parameters<T>): ReturnType<T> => {
    const wrappedFn = () => fn(...args);
    return waitUntil(wrappedFn, duration, error) as ReturnType<T>;
  };
}
