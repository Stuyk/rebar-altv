---
order: 100
---

# What is a Webview?

A Webview for this framework may also be known as a page.

Pages are HTML content that can be used to render user interfaces in-game.

Rebar has the concept of 3 different types of Pages.

1. Overlay
2. Persistent
3. Page

## What is a Page?

A page is a type of page that is only shown once, and controlled by user interaction.

Examples: `Inventory`, `ATM`, `Shops`

## What is the Overlay Type?

An overlay page is a type of page that is always shown when the user is not shown a `page`.

Examples: `HUD`, `Cash`, `Ammunition Count`

## What is the Persistent Type?

A persistent page is a type of page that will always be shown regardless of what is being shown on screen.

Examples: `Website Watermark`, `Logo`

## What CSS is Available?

Currently Rebar is shipped with [TailwindCSS](https://tailwindcss.com/) to quickly build out interfaces quickly.

It is **highly recommended** to install the [Tailwind CSS IntelliSense Extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) when working with `css`.

You can simply hit `CTRL + SPACE` to bring up auto-fill while browsing different `CSS` classes.
