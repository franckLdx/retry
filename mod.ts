/** 
 * Retry a function until it does not throw an exception.
 *  
 * @param fn: the function to execute
 * @param retryOptions: retry options ({@link RetryOptions})
 */
export async function retry<T>(
  fn: () => T,
  retryOptions: RetryOptions,
): Promise<T> {
  const wrapped = () =>
    new Promise<T>((resolve, reject) => {
      try {
        const result = fn();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  return retryAsync(wrapped, retryOptions);
}

/** 
 * Retry an async function until it does not throw an exception.
 *  
 * @param fn: the function to execute
 * @param retryOptions: retry options (@see RetryOptions)
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  { maxTry, delay: delay }: RetryOptions,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (maxTry > 1) {
      await wait(delay);
      return await retryAsync(fn, { delay: delay, maxTry: maxTry - 1 });
    }
    throw err;
  }
}

/** Retry options:
 * @param maxTry: maximum number of attempts. if fn is still throwing execption afect maxtry attempts, an exepction is thrown 
 * @param delay: number of miliseconds between each attempt.
 */
export interface RetryOptions {
  maxTry: number;
  delay: number;
}

/** An async function that does nothing during a number of milliseconds */
export function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
