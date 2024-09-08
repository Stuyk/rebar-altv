# useMessenger

Gives the ability to get `messages` from the messenger system as well as `emit messages` to the messenger system.

```html
<script lang="ts" setup>
    import { useMessenger } from '@Composables/useMessenger';

    const messenger = useMessenger();

    // Issue a command
    messenger.emit(`/id`);

    // Issue a message
    messenger.emit(`hi there!`);

    // Log all current messages, this is a ref variable for vue
    console.log(messenger.messages);
</script>
```
