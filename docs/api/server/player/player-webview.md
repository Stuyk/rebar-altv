# Webview

This specific controller allows controlling the client-side webview instance for a given player.

You can focus the webview, hide pages, or show pages with ease.

```ts
import { useWebview } from '@Server/player/webview.js';

const view = useWebview(player);

// Emit directly into the webview, and recieve the event
// in the webview with the 'useEvents' composable
view.emit('someevent', 'hello world!');

// Show the cursor and focus the webview instance
view.focus();

// Hide the cursor and unfocus the webview instance
view.unfocus();

// Hide a specific page
view.hide('Example');

// Show a specific page
view.show('Example', 'page');
```
