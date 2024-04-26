import * as alt from 'alt-server';

export function useAnimation(player: alt.Player) {
    function clear() {
        if (!player || !player.valid) {
            return;
        }

        player.clearTasks();
    }

    function playInfinite(dict: string, name: string, flags: number) {
        if (!player || !player.valid) {
            return;
        }

        player.playAnimation(dict, name, 8.0, 8.0, -1, flags, 1.0, false, false, false);
    }

    async function playFinite(
        dict: string,
        name: string,
        flags: number,
        timeoutInMs: number,
        doNotClear = false
    ): Promise<void> {
        if (!player || !player.valid) {
            return;
        }

        if (timeoutInMs <= 0) {
            timeoutInMs = 100;
        }

        player.playAnimation(dict, name, 8.0, 8.0, -1, flags, 1.0, false, false, false);
        await alt.Utils.wait(timeoutInMs);

        if (doNotClear) {
            return;
        }

        clear();
    }

    return {
        clear,
        playInfinite,
        playFinite,
    };
}
