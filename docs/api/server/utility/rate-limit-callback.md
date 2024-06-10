# Rate Limit Callback

When you're using events, or you need callbacks to be protected by a rate limiter, this is a wrapper you can use.

This prevents player invoked functions from being called too frequently.

In fact, if a player calls them too much, they will be kicked.

```ts
function doSomething(player: alt.Player) {
    console.log('this will call normally');
}

// This prevents the callback from being invoked unless 5 seconds has passed
alt.onClient('something-that-happens', Rebar.utility.useRateLimitCallback(doSomething, 'some-unique-identifier', 5000));
```
