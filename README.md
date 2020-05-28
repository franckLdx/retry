# retry
A little retry tool in deno. Ex:
```typescript
const result = await retryAsync(
  async ()=> {/* get some data if those data are ready, throw an expection otherwise */}, 
  { delay: 100, maxTry: 5 }
)
```
This will try 5 times to get the data. If data is not ready after the 5 attempts,
an exception is thrown. If data are obtained, retryAsync stop immediatly and returns
the data. 

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

You can also wait for a number of seconds
* to wait 1OO ms of milliseconds: <br/><code>await wait(100)</code> 


## API
* retry<T>(fn<T>, retryOptions): call repeteadly fn until fn does not throw and exception. Stop after retryOptions.maxTry count. Between each call wait retryOptions.delay milliseconds.
if stop to call fn after retryOptions.maxTry, throws fn execption, otherwise returns fn return value.
* retryAsync<T>(fn<T>, retryOptions): same as retry, except fn is an asynchronous function.
* retryOptions:
  - maxTry maximum calls to fn.
  - delay: delay between each call (in milliseconds).

Note: retry and retryAsync return type if the return type of the given fn.
