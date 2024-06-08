# useProxyFetch

Allows for you to register safe endpoints on server-side which can be called client-side, or server-side.

Effectively calls an API from the server address, rather than the player address.

```ts
const proxyFetch = Rebar.useProxyFetch();

// Get Register
proxyFetch.register('http://some-api-url.com:3000', 'GET');

// Get Usage
const result = await proxyFetch.fetch('http://some-api-url.com:3000');

// Post Auth
proxyFetch.register('http://some-api-url.com:3000/auth', 'POST');

// Post Usage
const result = await proxyFetch.fetch('http://some-api-url.com:3000/auth', {
    headers: { Authorization: 'bearer whatever' }, // Can pass tokens safely from server-side
    body: JSON.stringify({ whatever: 'hi' }), // Can pass body data safely from server-side
});
```
