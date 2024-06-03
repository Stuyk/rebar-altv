# Webview

When using the webview on client-side, you have a lot of options.

```ts
import { useWebview } from '@Client/webview/index.js';

// Show a page, automatically focuses if page type
useWebview().show('Example', 'page');

// Hide a page, automatically unfocuses
useWebview().hide('Example');

// Focus webview, and show cursor
useWebview().focus();

// Unfocus webview, and hide cursor
useWebview().unfocus();

// Check if any page is open
useWebview().isAnyPageOpen();

// Check if specific page is open
useWebview().isSpecificPageOpen('Example');

// Hide all pages
useWebview().hideAll(['Example']);

// Hide all pages by type: "persistent" | "overlay" | "page"
useWebview().hideAllByType(type);

// Set up event listener
useWebview().on('someWebviewToClientEvent', (...args) => {
    console.log('Some event triggered', ...args);
})

// Remove event listener
useWebview().off('someWebviewToClientEvent');

// Emit event in webview
useWebview().emit('someClientToWebviewEmit', ...args);

// Show cursor
useWebview().showCursor(true);

// Hide cursor
useWebview().showCursor(false);

// Handles RPC calls from the webview on the client-side
useWebview().onRpc('some-event', () => {
    return 'hello there'
});
```
