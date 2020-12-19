import { retryAsync } from "./retry.ts";
import { RetryOptions } from "./options.ts";

export function retryAsyncDecorator<
  // deno-lint-ignore no-explicit-any
  T extends (...args: any[]) => Promise<any>,
>(
  fn: T,
  retryOptions?: RetryOptions,
) {
  return (...args: Parameters<T>): ReturnType<T> => {
    const wrappedFn = () => fn(...args);
    return retryAsync(wrappedFn, retryOptions) as ReturnType<T>;
  };
}
