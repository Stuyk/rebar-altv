# useEvents

This is an event wrapper that allows for communication directly to the server, or the client.

```html
<script lang="ts" setup>
    import { useEvents } from '@Composables/useEvents';

    const events = useEvents();

    // Recieve an event from server or client
    events.on('event-from-server-or-client', (var1: string, var2: number) => {
        console.log(var1, var2);
    });

    // Can be recieved with the useWebview().on event
    const myVariable = true;
    events.emitClient('emit-to-client-event', myVariable);

    // Can be recieved with the alt.onClient event
    events.emitServer('emit-to-server-event', myVariable);

    // Emit to the server-side RPC and get a result from the server
    const result = await events.emitServerRpc('get-something', 'hello');
    console.log(`Webview Result: ${result}`);

    // Emit to the client-side, but only works with useWebview().onRpc('get-something', () => {})
    const result = await events.emitClientRpc('get-something', 'hello');
</script>
```

## Server Side RPC Handling

If you use the event `emitServerRpc` you can use the normal `alt.onRpc` to handle the request.

A simple but seamless integration with existing alt:V APIs.

```ts
import * as alt from 'alt-server';

alt.onRpc('get-something', (player, arg1: string) => {
    const result = arg1 + ' world';
    return result;
});
```

## Client Side RPC Handling

This one works differently on client-side, so you'll have to access the `useWebview` function, and then add your listener callback.

```ts
import { useWebview } from '@Client/webview/index.js';

const view = useWebview();

view.onRpc('get-something', (arg1: string) => {
    return arg1 + ' world';
});
```

## Key Presses

If you're trying to listen for certain keypresses regardless of focus you can use `onKeyUp` and `offKeyUp`.

Generally you want to bind `onKeyUp` with the `onMounted` event, and turn off the key listener with `offKeyUp` when `unmounting`.

```ts
import { onMounted, onUnmounted } from 'vue';
import { useEvents } from '../../../../webview/composables/useEvents';

const Events = useEvents();

function doSomething() {
    console.log('hello world');
}

onUnmounted(() => {
    Events.offKeyUp('inventory');
});

onMounted(() => {
    Events.onKeyUp('inventory', 73, doSomething);
});
```
