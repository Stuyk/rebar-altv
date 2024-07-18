---
order: 97
---

# FAQ

Frequently asked questions about Rebar.

## Where do I put my mods?

You put them inside of the `resources` folder, and load it like a normal [alt:V Resource](https://docs.altv.mp/articles/resources.html).

## None of my changes are saving when I modify files?

Be sure that you are only modifying files inside of the `src` directory.

## Are FiveM scripts compatible?

No, we use TypeScript in this framework and furthermore it is written for [https://altv.mp](https://altv.mp) client.

## Can I use my own frontend framework?

No, you will have to do a lot of changes to get any other framework to work correctly.

It is not recommended, and to keep all plugins compatible we use Vue 3 and the same CSS framework across all plugins.

## Can I use my own CSS?

Sure, but it is recommended to use `Tailwind` to keep everything compatible across all plugins.

## Can I use my own database?

No, it is highly recommended to stick to MongoDB and to lower the complexity for everyone using your plugins.

To run your own database you will need to write it as a plugin and use it exclusively.

Doing so may limit your ability to load plugins from other users.

## Can I use npm packages client-side

Nope! You won't ever be able to. However, you can use them in the webview, and on server-side.

## Do I need to buy a server?

Only buy a server when you're ready for your server to go live.

Otherwise, stick to local testing and allowing others to join locally.

## How can I speed up development time?

There are a number of ways to do this, but here are some recommended approaches.

1. Disable any third-party plugins
2. Disable any MLOs that need to be loaded

Doing both of these will increase load time, and allow you to focus on writing your plugin.

## Can I sell plugins?

Absolutely, however Rebar does not provide any resources to secure your code. You are fully responsible for updating your plugin as well as maintaining compatability with future updates.

_Keep in mind there is no way to properly secure code._
