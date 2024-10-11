import * as alt from 'alt-server';

export function useAnimation(player: alt.Player) {
    function clear() {
        if (!player || !player.valid) {
            return;
        }

        player.clearTasks();
    }

    function playInfinite(
        dict: string,
        name: string,
        flags: number,
        blendInDuration: number = 8.0,
        blendOutDuration: number = 8.0,
        playBackRate: number = 1.0,
    ) {
        if (!player || !player.valid) {
            return;
        }

        player.playAnimation(
            dict,
            name,
            blendInDuration,
            blendOutDuration,
            -1,
            flags,
            playBackRate,
            false,
            false,
            false,
        );
    }

    async function playFinite(
        dict: string,
        name: string,
        flags: number,
        blendInDuration: number = 8.0,
        blendOutDuration: number = 8.0,
        durationInMs: number = 1000,
        playBackRate: number = 1.0,
        doNotClear: boolean = false,
    ): Promise<void> {
        if (!player || !player.valid) {
            return;
        }

        player.playAnimation(
            dict,
            name,
            blendInDuration,
            blendOutDuration,
            durationInMs,
            flags,
            playBackRate,
            false,
            false,
            false,
        );

        if (!doNotClear) {
            await alt.Utils.wait(durationInMs);
            clear();
        }
    }

    return {
        clear,
        playInfinite,
        playFinite,
    };
}
