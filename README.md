# retry
A simple retry/wait tool for deno. 
Can re-call a function until a sucess, or bind a timeout to a function 

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=black)](https://deno.land/x/retry) 
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/franckLdx/retry/blob/master/LICENSE) 


---
__Breaking change__: For those who are using 0.x in __typescript__, you may have to add a type to RetryOptions if you want to use
the new `until`function. This type is the called function returns type.

---


## How to:
* to retry something: 
  ```typescript
  const result = await retry(
    ()=> {/* do something */}, 
    { delay:100, maxTry:5 }
  );
  ```
* to retry something async : 
  ```typescript
  const result = await retryAsync(
    async ()=> {/* do something */}, 
    { delay:100, maxTry:5 }
  )
  ```
* to retry until the answer is 42 : 
  ```typescript
  try {
    await retryAsync(
      async (): Promise<number> => {/* do something */}, 
      { 
        delay:100, 
        maxTry:5, 
        until: (lastResult: number) => lastResult === 42 
      }
    );
  } catch (err) {
    if (isTooManyTries(err)) {
      // Did not get 42 after 'maxTry' calls
    } else {
      // something else goes wrong 
    }
  }
  ```
* Need to call a function at multiple place with same retryOptions ? Use decorators:
  ```typescript
  const fn = (title: string, count:number) => return `${count}. ${title}`; 
  const decoratedFn = retryDecorator(
    fn, 
    { delay:100, maxTry:5 }
  );
  const title1 = await decoratedFn("Intro", 1);
  const title2 = await decoratedFn("A chapter", 2);

  const fn = async (name: string): Promise<any> => { /* something async */ }; 
  const decoratedFn = retryAsyncDecorator(
    fn, 
    { delay:100, maxTry:5 }
  );
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
  const decoratedFn = waitUntilDecorator(
    fn, 
    { delay:100, maxTry:5 }
  );
  const title1 = await decoratedFn("Intro", 1);
  const title2 = await decoratedFn("A chapter", 2);

  const fn = async (name: string): Promise<any> => { /* a long task */ }; 
  const decoratedFn = waitUntilAsyncDecorator(
    fn, 
    { delay:100, maxTry:5 }
  );
  const result1 = await decoratedFn("John");
  const result2 = await decoratedFn("Doe");
  ```
___
## Utils
`retry` comes with handy utilities function for common use case:
* to retry until a function returns something defined (aka not null neither not undefined):
```typescript
  // in all cases results is a string and cannot be null or undefined
  const result = await retryUntilDefined( (): string|undefined => { ... } ) );
  
  const result = await retryUntilAsyncDefined( (): Promise<string|null> => { ... } );
  
  const decorated = retryUntilDefinedDecorator( (p1: string): string|undefined => { ... } );
  const result = await decorated('hello world');
  
  const decorated = retryAsyncUntilDefinedDecorator( (p1: string): Promise<string|undefined> => { ... } );
  const result = await decorated('hello world');
```

* to retry until a function returns something truthy:
```typescript
  // in all cases results is a string and cannot be null or undefined
  const result = await retryUntilTruthy( (): boolean|undefined => { ... } ) );
  
  const result = await retryAsyncUntilTruthy( (): Promise<number|null> => { ... } );
  const decorated = retryUntilTruthyDecorator( (p1: string): boolean|undefined => { ... } );
  const result = await decorated('hello world');
  
  const decorated = retryAsyncUntilTruthyDecorator( (p1: string): Promise<boolean|null> => { ... } );
  const result = await decorated('hello world');
```

___
## API
### Retry familly
* `retry<T>(fn<T>, retryOptions?)`: call repeteadly fn until fn does not throw an exception. Stop after retryOptions.maxTry count. Between each call wait retryOptions.delay milliseconds.
if stop to call fn after retryOptions.maxTry, throws fn execption, otherwise returns fn return value.
* `retryAsync<T>(fn<T>, retryOptions?)`: same as retry, except fn is an asynchronous function.
* `retryOptions<T>`:
  - maxTry [optional] maximum calls to fn.
  - delay: [optional] delay between each call (in milliseconds).
  - until: [optional] (lastResult: T) => boolean: return false if last fn results is not the expected one: continue to call fn until `until` returns true. A `TooManyTries` is thrown after `maxTry` calls to fn;
  When any option is not provided, the default one is applyed. The default options are:
  ```
    delay: 250,  // call fn every 250 ms during one minute 
    maxTry: 4 * 60, 
    until: null
  ```
* `setDefaultRetryOptions<T>(retryOptions<T>: RetryOptions)`: change the default retryOptions, or only the default maxTry or only the default delay). It always returns the full default retryOptions.
* `getDefaultRetryOptions<T>()`: returns the current default retry options.
* `retryAsyncDecorator<T>(fn: T, retryOptions?: RetryOptions<T>)` and  `retryDecorator<T>(fn: T, retryOptions<T>?: RetryOptions)`: decorators that return a function with same signature than the given function. On decorated call, fn is called repeteadly it does not throw an exception or until retryOptions.maxTry.
* `TooManyTries`: an error thrown by retry functions when `until` returns false after `maxTry` calls. It comes with a type guard: 
```typescript
  if (isTooManyTries(error)) {
    // fn does not complete within 10 seconds
  }
````
### Wait familly
* `waitUntil<T>(fn<T>, duration?, error?)`: waitUntil call asynchronously fn once. If fn complete within the duration (express in miliseconds), waitUntil returns the fn result. Otherwhise it thows the given error (if any) or a TimeoutError exception.
* `waitUntilAsync<T>(fn<T>, duration?, error?)`: same as waitUntil, except fn is an asynchronous function.
* TimeoutError: an error thrown by waitUntil and waitUntilAsync. It comes with a isTimeoutError type guard:
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
## Utils familly
`retry` comes with handy utilities function for common use case:

__UntilDefined :__
To retry until we get a value which is neither null nor undefined.

For calling sync function:

```typescript
retryUntilDefined<RETURN_TYPE>(
  fn: () => RETURN_TYPE | undefined | null,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE>
```

```typescript
retryUntilDefinedDecorator<PARAMETERS_TYPE, RETURN_TYPE>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE | undefined | null,
  retryOptions?: RetryUtilsOptions,
): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>
```

For calling async function:

```typescript
retryAsyncUntilDefined<RETURN_TYPE>(
  fn: () => Promise<RETURN_TYPE | undefined | null>,
  options?: RetryUtilsOptions,
): Promise<RETURN_TYPE>
```

```typescript
retryAsyncUntilDefinedDecorator<PARAMETERS_TYPE, RETURN_TYPE>(
  fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE | undefined | null>,
  retryOptions?: RetryUtilsOptions,
): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>
```

__UntilTruthy :__
To retry until we get a value which javascript consider as truthy.

For calling sync function:

```typescript
retryUntilTruthy<PARAMETERS_TYPE, RETURN_TYPE>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE>
```

```typescript
retryUntilTruthyDecorator<PARAMETERS_TYPE,  RETURN_TYPE>(
  fn: (...args: PARAMETERS_TYPE) => RETURN_TYPE,
  retryOptions?: RetryUtilsOptions,
): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>
```

For calling async function:

```typescript
retryAsyncUntilTruthy<PARAMETERS_TYPE, RETURN_TYPE>(
  fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>,
  retryOptions?: RetryUtilsOptions,
): Promise<RETURN_TYPE>
```

```typescript
retryAsyncUntilTruthyDecorator<PARAMETERS_TYPE, RETURN_TYPE>(
  fn: (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>,
  retryOptions?: RetryUtilsOptions,
): (...args: PARAMETERS_TYPE) => Promise<RETURN_TYPE>
```


`RetryUtilsOptions` type is: 
  - maxTry [optional] maximum calls to fn.
  - delay: [optional] delay between each call (in milliseconds).

When not provided, maxTry and delay of global options are applied.  




---
## Compatilibity
Use std 0.83.0 (deno 1.6.3) and is tested with latest deno 1.3.x, 1.4.x and 1.5.x.