# useEvents

This is an event wrapper that allows for communication directly to the server, or the client.

```html
<script lang="ts" setup>
    import { useEvents } from '../../../../webview/composables/useEvents';

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
</script>
```
