import { ref } from 'vue';
import { useEvents } from './useEvents';
import { Events } from '../../src/main/shared/events';

type Minimap = {
    x: number;
    y: number;
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
    aspectRatio: number;
    safeZone: number;
    screenWidth: number;
    screenHeight: number;
};

const minimap = ref<Minimap>();
const events = useEvents();

let isInit = false;

export function useMinimap() {
    function init() {
        if (isInit) {
            return;
        }

        isInit = true;
        events.on(Events.view.updateMinimap, (data: Minimap) => (minimap.value = data));
    }

    return {
        minimap,
        init,
    };
}
