// Copyright since 2020, FranckLdx. All rights reserved. MIT license.
import { deferred } from "./deps.ts";

export const asyncDecorator = <T>(fn: () => T) => {
  return (): Promise<T> => {
    const promise = deferred<T>();
    try {
      const result = fn();
      promise.resolve(result);
    } catch (err) {
      promise.reject(err);
    }
    return promise;
  };
};
