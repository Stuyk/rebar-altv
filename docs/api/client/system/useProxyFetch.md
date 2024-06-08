# useProxyFetch

This is the client version of the proxy fetch.

Server requires APIs to be registered before they can be called.

```ts
const clientRebar = useRebarClient();
const proxyFetch = clientRebar.useProxyFetch();

const result = await proxyFetch.fetch('http://some-api-endpoint.com:3000');
```
