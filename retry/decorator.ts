import { retry, retryAsync } from "./retry.ts";
import { RetryOptions } from "./options.ts";

export function retryAsyncDecorator<
  // deno-lint-ignore no-explicit-any
  T extends (...args: any[]) => Promise<any>,
>(
  fn: T,
  retryOptions?: RetryOptions<T>,
) {
  return (...args: Parameters<T>): ReturnType<T> => {
    const wrappedFn = () => fn(...args);
    return retryAsync(wrappedFn, retryOptions) as ReturnType<T>;
  };
}

export function retryDecorator<
  // deno-lint-ignore no-explicit-any
  T extends (...args: any[]) => any,
>(
  fn: T,
  retryOptions?: RetryOptions<T>,
) {
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const wrappedFn = () => fn(...args);
    return retry(wrappedFn, retryOptions) as Promise<ReturnType<T>>;
  };
}
