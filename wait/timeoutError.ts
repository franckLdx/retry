export class TimeoutError extends Error {
  isTimeout = true;
}
/** Type guard for TimeoutError */

export function isTimeoutError(error: Error): error is TimeoutError {
  return (error as TimeoutError).isTimeout === true;
}
