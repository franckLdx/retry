import { RetryOptions } from "../options.ts";

export type RetryUtilsOptions = Exclude<RetryOptions<void>, "until">;
