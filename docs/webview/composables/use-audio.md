# useAudio

Gives you the ability to play custom sounds from the Webview.

```html
<script lang="ts" setup>
    import { useAudio } from '../../../../webview/composables/useAudio';

    const audio = useAudio();

    // Play a simple custom sound
    audio.play('/sounds/my-cool-sound.ogg');
</script>
```
