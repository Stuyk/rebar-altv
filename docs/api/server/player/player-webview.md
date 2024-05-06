# Webview

This specific controller allows controlling the client-side webview instance for a given player.

You can focus the webview, hide pages, or show pages with ease.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

async function someWebviewThing(player: alt.Player, attempts = 0) {
    const view = Rebar.player.useWebview(player);

    // Show the cursor and focus the webview instance
    view.focus();

    // Hide the cursor and unfocus the webview instance
    view.unfocus();

    // Hide a specific page
    view.hide('Example');

    // Show a specific page
    view.show('Example', 'page');

    if (attempts >= 5) {
        player.kick('something went wrong');
        return;
    }

    // Wait for a page to be ready / shown before emitting events
    const result = await view.isReady('Example', 'page');
    if (!result) {
        attempts++;

        showSelection(player, attempts);
        return;
    }

    // Emit directly into the webview, and recieve the event
    // in the webview with the 'useEvents' composable
    view.emit('someevent', 'hello world!');
}
```
