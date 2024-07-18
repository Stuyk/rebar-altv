# useAudio

Gives you the ability to play custom sounds from the Webview.

If you wish to play frontend sounds check out the [Frontend Sound List](../../../data/frontend-sounds.md).

```html
<script lang="ts" setup>
    import { useAudio } from '@Composables/useAudio';

    const audio = useAudio();

    // Play a simple custom sound
    audio.play('/sounds/my-cool-sound.ogg');

    // Play a native frontend sound from the webview and invoke the native.
    // audioName, audioRef, audioBank (Optional)
    audio.playFrontendSound('NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
</script>
```
