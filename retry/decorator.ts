import { retryAsync } from "./retry.ts";
import { RetryOptions } from "./options.ts";

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export function retryAsyncDecorator<
  // deno-lint-ignore no-explicit-any
  T extends (...args: any[]) => Promise<any>,
>(
  fn: T,
  retryOptions?: RetryOptions,
) {
  type U = ReturnType<T>;
  return (...args: Parameters<T>): ReturnType<T> => {
    const wrappedFn = () => fn(...args);
    return retryAsync(wrappedFn, retryOptions) as ReturnType<T>;
  };
}
