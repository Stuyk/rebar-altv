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
```
