# retry
A simple retry/wait tool for deno. 
Can re-call a function until a sucess, or bind a timeout to a function 

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=black)](https://deno.land/x/retry) 
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/franckLdx/retry/blob/master/LICENSE) 

## How to:
* to retry something: 
  ```typescript
  const result = await retry(()=> {/* do something */}, {delay:100,maxTry:5})
  ```
* to retry something async : 
  ```typescript
  const result = await retryAsync(async ()=> {/* do something */}, {delay:100,maxTry:5})
  ```
* Need to call a function at multiple place with same retryOptions ? Use decorators:
  ```typescript
  const fn = (title: string, count:number) => return `${count}. ${title}`; 
  const decoratedFn = retryDecorator(fn, { delay:100, maxTry:5 });
  const title1 = await decoratedFn("Intro", 1);
  const title2 = await decoratedFn("A chapter", 2);

  const fn = async (name: string): Promise<any> => { /* something async */ }; 
  const decoratedFn = retryAsyncDecorator(fn, {delay:100,maxTry:5});
  const result1 = await decoratedFn("John");
  const result2 = await decoratedFn("Doe");
  ```
* to set a timeout: 
  ```typescript
  try {
    const result = await waitUntil(async ()=> {/* do something */}, 10000);
  } catch (err) {
    if (isTimeoutError(error)) {
      // fn does not complete within 10 seconds
    } else {
      // fn throws an exception
    }
  }
  ```
* to set a timeout on something async : 
  ```typescript
  try {
    const result = await waitUntilAsync(async ()=> {/* do something */}, 10000);
  } catch (err) {
    if (isTimeoutError(error)) {
      // fn does not complete within 10 seconds
    } else {
      // fn throws an exception
    }
  }
  ```
* Need to call a function at multiple place with same durations ? Use decorators:
  ```typescript
  const fn = (title: string, count:number) => /* a long task */; 
  const decoratedFn = waitUntilDecorator(fn, { delay:100, maxTry:5 });
  const title1 = await decoratedFn("Intro", 1);
  const title2 = await decoratedFn("A chapter", 2);

  const fn = async (name: string): Promise<any> => { /* a long task */ }; 
  const decoratedFn = waitUntilAsyncDecorator(fn, {delay:100,maxTry:5});
  const result1 = await decoratedFn("John");
  const result2 = await decoratedFn("Doe");
  ```
___
## API
### Retry familly
* `retry<T>(fn<T>, retryOptions?)`: call repeteadly fn until fn does not throw an exception. Stop after retryOptions.maxTry count. Between each call wait retryOptions.delay milliseconds.
if stop to call fn after retryOptions.maxTry, throws fn execption, otherwise returns fn return value.
* `retryAsync<T>(fn<T>, retryOptions?)`: same as retry, except fn is an asynchronous function.
* `retryOptions`:
  - maxTry maximum calls to fn.
  - delay: delay between each call (in milliseconds).
  When retryOptions is not provided, the default one is applyed. The default retry option is
  ```typescript
    delay: 250,  // call fn every 250 ms during one minute 
    maxTry: 4 * 60, 
  ```
* `setDefaultRetryOptions(retryOptions: Partial<RetryOptions>)`: change the default retryOptions, or only the default maxTry or only the default delay). It always returns the full default retryOptions.
* `getDefaultRetryOptions()`: returns the current default retry options.
* `retryAsyncDecorator(fn: T, retryOptions?: RetryOptions)` and  `retryDecorator(fn: T, retryOptions?: RetryOptions)`: decorators that return a function with same signature than the given function. On decorated call, fn is called repeteadly it does not throw an exception or until retryOptions.maxTry.
### Wait familly
* `waitUntil<T>(fn<T>, duration?, error?)`: waitUntil call asynchronously fn once. If fn complete within the duration (express in miliseconds), waitUntil returns the fn result. Otherwhise it thows the given error (if any) or a TimeoutError exception.
* `waitUntilAsync<T>(fn<T>, duration?, error?)`: same as waitUntil, except fn is an asynchronous function.
* TimeoutError: an error thrown by waitUntil and waitUntilAsync. It comse with a isTimeoutError type guard:
```typescript
  if (isTimeoutError(error)) {
    // fn does not complete within 10 seconds
  }
```
In case of timeout fn is still executing. It is advise to add a mean to abort it.
* When duration is not provided, the default one is applyed. The default default is 60000ms.
* `setDefaultDuration(duration: number)`: change the default duration.
* `getDefaultDuration()`: returns the current default duration.
* `waitUntilAsyncDecorator(fn: T, duration?: number, error?: Error)` and `waitUntilDecorator(fn: T, duration?: number, error?: Error)`: decorators that return a function with same signature than the given function. On decorated call, fn is called bounded to the duration.

---
## Compatilibity
Use std 0.81.0 (deno 1.6.1) but is is aslo tested with lates deno 1.3.x, 1.4.x and 1.5.x.