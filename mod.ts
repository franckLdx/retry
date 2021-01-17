// Copyright since 2020, FranckLdx. All rights reserved. MIT license.

export { retry, retryAsync } from "./retry/retry.ts";
export {
  getDefaultRetryOptions,
  setDefaultRetryOptions,
} from "./retry/options.ts";
export { isTooManyTries, TooManyTries } from "./retry/tooManyTries.ts";
export type { RetryOptions } from "./retry/options.ts";
export { retryAsyncDecorator, retryDecorator } from "./retry/decorator.ts";

export { waitUntil, waitUntilAsync } from "./wait/wait.ts";
export type { TimeoutError } from "./wait/timeoutError.ts";
export { isTimeoutError } from "./wait/timeoutError.ts";
export { getDefaultDuration, setDefaultDuration } from "./wait/options.ts";
export {
  waitUntilAsyncDecorator,
  waitUntilDecorator,
} from "./wait/decorators.ts";

export {
  retryAsyncUntilDefined,
  retryUntilDefined,
} from "./retry/utils/untrilDefined/retry.ts";

export {
  retryAsyncUntilDefinedDecorator,
  retryUntilDefinedDecorator,
} from "./retry/utils/untrilDefined/decorators.ts";

export {
  retryAsyncUntilTruthy,
  retryUntilTruthy,
} from "./retry/utils/untilTruthy/retry.ts";

export {
  retryAsyncUntilTruthyDecorator,
  retryUntilTruthyDecorator,
} from "./retry/utils/untilTruthy/decorators.ts";

export type { RetryUtilsOptions } from "./retry/utils/options.ts";
