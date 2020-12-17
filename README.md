# retry
A simple retry/wait tool for deno. 
Can re-call a function until a sucess, or bind a timeout to a function 
Ex:
```typescript
const result = await retryAsync(
  async ()=> {/* get some data if those data are ready, throw an expection otherwise */}, 
  { delay: 100, maxTry: 5 }
)
```
This will try 5 times to get the data. If data is not ready after the 5 attempts,
an exception is thrown. If data are obtained, retryAsync stop immediatly and returns
the data. 

```typescript
const result = await waitUntilAsync(fn, 10000);
```
This wait fn to complete withint 10 seconds. If fn complete on a sucess, return fn return value. If fn complete on an error, throw fn's error.
If fn does not complete within 10 seconds, throws a TimeoutError.

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
Above examples make up to 5 attempts, waiting 100ms between each try.
* to set a timeout: 
  ```typescript
  try {
    const result = await waitUntil(async ()=> {/* do something */}, 10000);
  } catch (err) {
    if (error instanceof TimeoutError) {
      // fn does not complete
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
    if (error instanceof TimeoutError) {
      // fn does not complete
    } else {
      // fn throws an exception
    }
  }
  ```
Above examples fn has 10 seconds to complete, otherwhise an exception is thrown.

## API
* retry<T>(fn<T>, retryOptions): call repeteadly fn until fn does not throw and exception. Stop after retryOptions.maxTry count. Between each call wait retryOptions.delay milliseconds.
if stop to call fn after retryOptions.maxTry, throws fn execption, otherwise returns fn return value.
* retryAsync<T>(fn<T>, retryOptions): same as retry, except fn is an asynchronous function.
* retryOptions:
  - maxTry maximum calls to fn.
  - delay: delay between each call (in milliseconds).
* waitUntil<T>(fn<T>, delay, error?): waitUntil call asynchronously fn once. If fn complete within the delay (express in miliseconds), waitUntil returns the fn result. Otherwhise it thows the given error (if any) or a TimeoutError exception.
* waitUntilAsync<T>(fn<T>, delay, error?): same as waitUntil, except fn is an asynchronous function.
* TimeoutError: an error thrown by waitUntil and waitUntilAsync. It has a property isTimeout set to true: therefore there's two means to check os fn timeout:
```typescript
  error instanceof TimeoutError
  or
  (error as any).isTimeout
```
In case of timeout fn is still executing. It is advise to add a mean to abort it.
Note: retry, retryAsync, waitUntil and waitUntilAsync return type is the return type of the given fn.
* setDefaultRetryOptions and getDefaultRetryOptions respectively set/get the retry options apply by default. When not set default retry options are delay: 250 and maxTry: 240 (a test eveyr 250 ms during one minue). 

## Compatilibity
Use std 0.81.0 (deno 1.6.1) but is is aslo tested with lates deno 1.3.x, deno 1.4.x and deno 1.5.x.