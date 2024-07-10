import { Events } from '@Shared/events/index.js';
import * as Utility from '@Shared/utility/index.js';
import * as alt from 'alt-server';
import { ProgressBar } from '../../shared/types/progressBar.js';

const GroupType = 'progressbar';
const MAX_BARS = 10;

const barsGroup = new alt.VirtualEntityGroup(MAX_BARS);

/**
 * Create a progress bar seen by all players
 *
 * @export
 * @param {ProgressBar} progressbar
 * @param {boolean} isTimer
 * @param {number} maxDistance
 * @return
 */
export function useProgressbarGlobal(progressbar: ProgressBar, isTimer = false, maxDistance: number = 15) {
    const callbacks: Function[] = [];
    let interval: number;

    if (maxDistance > 25) {
        maxDistance = 25;
    }

    if (!progressbar.uid) {
        progressbar.uid = Utility.uid.generate();
    }

    if (isTimer) {
        interval = alt.setInterval(() => {
            updateProgress(progressbar.value + 1);
            updateLabel(`${progressbar.maxValue - progressbar.value}s`);
        }, 1000);
    }

    let entity = new alt.VirtualEntity(barsGroup, new alt.Vector3(progressbar.pos), maxDistance, {
        type: GroupType,
        progressbar,
    });

    entity.dimension = progressbar.dimension ? progressbar.dimension : 0;

    function destroy() {
        try {
            entity.destroy();
        } catch (err) {}
    }

    function update() {
        try {
            entity.destroy();
        } catch (err) {}

        entity = new alt.VirtualEntity(barsGroup, new alt.Vector3(progressbar.pos), maxDistance, {
            type: GroupType,
            progressbar,
        });
    }

    function updateProgress(value: number) {
        progressbar.value = value;
        if (progressbar.value >= progressbar.maxValue) {
            progressbar.value = progressbar.maxValue;
            entity.destroy();

            if (interval) {
                alt.clearInterval(interval);
                interval = undefined;
            }

            for (let cb of callbacks) {
                cb();
            }

            return;
        }

        update();
    }

    function updateLabel(label: string) {
        progressbar.label = label;
        update();
    }

    /**
     * Callback for when the progress bar is completed
     *
     * @param {Function} cb
     */
    function onFinish(cb: Function) {
        callbacks.push(cb);
    }

    /**
     * An asynchronous wait function to wait until the progress bar is completed
     *
     * @return
     */
    function waitForFinish() {
        return new Promise((resolve: Function) => {
            const checkInterval = alt.setInterval(() => {
                if (progressbar.value < progressbar.maxValue) {
                    return;
                }

                resolve();
                alt.clearInterval(checkInterval);
                return;
            }, 500);
        });
    }

    return {
        destroy,
        getEntity() {
            return entity;
        },
        getProgressbar() {
            return progressbar;
        },
        getValue() {
            return progressbar.value;
        },
        getMaxValue() {
            return progressbar.maxValue;
        },
        onFinish,
        updateProgress,
        updateLabel,
        waitForFinish,
    };
}

export type GlobalProgressbar = ReturnType<typeof useProgressbarGlobal>;

/**
 * Create a progress bar only seen by a single player
 *
 * @export
 * @param {alt.Player} player
 * @param {ProgressBar} progressbar
 * @return
 */
export function useProgressbarLocal(player: alt.Player, progressbar: ProgressBar, isTimer = false) {
    const callbacks: Function[] = [];
    let interval: number;
    let isDead = false;

    if (!progressbar.uid) {
        progressbar.uid = Utility.uid.generate();
    }

    if (!progressbar.dimension) {
        progressbar.dimension = 0;
    }

    if (isTimer) {
        interval = alt.setInterval(() => {
            updateProgress(progressbar.value + 1);
            updateLabel(`${progressbar.maxValue - progressbar.value}s`);
        }, 1000);
    }

    function destroy() {
        player.emit(Events.controllers.progressbar.destroy, progressbar.uid);
    }

    function updateProgress(value: number) {
        progressbar.value = value;
        if (progressbar.value >= progressbar.maxValue) {
            isDead = true;

            if (interval) {
                alt.clearInterval(interval);
                interval = undefined;
            }

            progressbar.value = progressbar.maxValue;
            player.emit(Events.controllers.progressbar.destroy, progressbar.uid);

            for (let cb of callbacks) {
                cb();
            }

            return;
        }

        update();
    }

    function updateLabel(label: string) {
        progressbar.label = label;
        update();
    }

    function update() {
        if (isDead) {
            return;
        }

        player.emit(Events.controllers.progressbar.create, progressbar);
    }

    /**
     * Callback for when the progress bar is completed
     *
     * @param {Function} cb
     */
    function onFinish(cb: Function) {
        callbacks.push(cb);
    }

    /**
     * An asynchronous wait function to wait until the progress bar is completed
     *
     * @return
     */
    function waitForFinish() {
        return new Promise((resolve: Function) => {
            const checkInterval = alt.setInterval(() => {
                if (progressbar.value < progressbar.maxValue) {
                    return;
                }

                resolve();
                alt.clearInterval(checkInterval);
                return;
            }, 500);
        });
    }

    player.emit(Events.controllers.progressbar.create, progressbar);

    return {
        destroy,
        getProgressbar() {
            return progressbar;
        },
        getValue() {
            return progressbar.value;
        },
        getMaxValue() {
            return progressbar.maxValue;
        },
        onFinish,
        updateProgress,
        updateLabel,
        waitForFinish,
    };
}

export type LocalTextLabel = ReturnType<typeof useProgressbarLocal>;
