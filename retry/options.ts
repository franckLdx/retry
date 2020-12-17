/** 
 * Retry options:
 *  - maxTry: maximum number of attempts. if fn is still throwing execption afect maxtry attempts, an exepction is thrown 
 *  - delay: number of miliseconds between each attempt.
 */
export interface RetryOptions {
  maxTry: number; // maximum number of attempts. if fn is still throwing execption afect maxtry attempts, an exepction is thrown
  delay: number; // number of miliseconds between each attempt.
}

export let defaultRetryOptions: RetryOptions = {
  delay: 250,
  maxTry: 4 * 60,
};

/** Set default retry options */
export function setDefaultRetryOptions(
  retryOptions: Partial<RetryOptions>,
): RetryOptions {
  defaultRetryOptions = { ...defaultRetryOptions, ...retryOptions };
  return getDefaultRetryOptions();
}

/** Returns the current retry options. To change default options, use setDefaultRetryOptions: do not try to modify this object */
export function getDefaultRetryOptions(): Readonly<RetryOptions> {
  return { ...defaultRetryOptions };
}
