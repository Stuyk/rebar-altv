# Development

When developing there are a handful of useful commands you can use in a `terminal` to help you build your server.

Let's talk about what some of those commands are.

## Development Mode

If you want to work on your code and automatically reconnect ensure you enable `debug` for your `alt:V Client` and then run the following in a `terminal`.

```sh
pnpm dev
```

## Webview Development Mode

If you want to focus on your Webview development, you can use the following to open a local server to preview pages.

**Note:** Ensure you restart the server when you create new vue components or new pages.

```sh
pnpm webview:dev
```

## Plugins

Plugins should be your #1 way to build new features for your server. Try to build everything you can inside of a plugin.
