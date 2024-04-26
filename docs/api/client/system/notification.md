# Notification

If you wish to override the default GTA:V notification system, you can use the built in notification system.

When you register an `on` event with `useNotification` it will stop default notifications from displaying.

You can now use the messages in your own notification system.

```ts
import { useNotification } from '@Client/system/notification.js';

const notification = useNotification();

notification.on((msg) => {
    alt.log(msg);
});
```
