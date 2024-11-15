import * as alt from 'alt-server';
import * as native from 'natives';
import { PedOptions, OmitFirstArg } from '@Shared/types/index.js';
import { Events } from '../../shared/events/index.js';
import * as Utility from '@Shared/utility/index.js';

const sessionKey = 'ped:uid';

type PedNatives = Pick<
    typeof native,
    | 'clearPedTasks'
    | 'clearPedTasksImmediately'
    | 'getIsTaskActive'
    | 'isEntityPlayingAnim'
    | 'isPedArmed'
    | 'isPedDeadOrDying'
    | 'isPedInCover'
    | 'isPedInVehicle'
    | 'isPedStopped'
    | 'taskAchieveHeading'
    | 'taskAimGunAtCoord'
    | 'taskAimGunAtEntity'
    | 'taskClearLookAt'
    | 'taskClimb'
    | 'taskClimbLadder'
    | 'taskCower'
    | 'taskEnterVehicle'
    | 'taskExitCover'
    | 'taskGetOffBoat'
    | 'taskGoStraightToCoord'
    | 'taskGoToCoordAnyMeans'
    | 'taskGoToEntity'
    | 'taskLeaveAnyVehicle'
    | 'taskOpenVehicleDoor'
    | 'taskPatrol'
    | 'taskPlayAnim'
    | 'taskReloadWeapon'
    | 'taskSeekCoverFromPos'
    | 'taskShootAtCoord'
    | 'taskShootAtEntity'
    | 'taskStartScenarioInPlace'
    | 'taskSynchronizedScene'
    | 'taskUseMobilePhone'
    | 'taskVehiclePark'
    | 'taskWanderInArea'
    | 'taskWanderSpecific'
    | 'taskWanderStandard'
>;

type PedDeathCallback = (uid: string, killer: alt.Entity, weaponHash: number) => void;

const peds: Map<string, ReturnType<typeof usePed>> = new Map();

export function usePed(ped: alt.Ped, uid?: string) {
    const callbacks: Array<PedDeathCallback> = [];

    if (!uid) {
        uid = Utility.uid.generate();
    }

    ped.setMeta(sessionKey, uid);

    function updateNetOwner() {
        if (!ped.valid) {
            return;
        }

        if (!ped.netOwner) {
            const closestPlayer = getClosestPlayer();
            if (!closestPlayer) {
                return;
            }

            ped.setNetOwner(closestPlayer);
        }
    }

    /**
     * Set extra options on this ped
     *
     * @template K
     * @param {K} option
     * @param {boolean} value
     */
    function setOption<K extends keyof PedOptions>(option: K, value: boolean) {
        if (!ped.valid) {
            return;
        }

        ped.setStreamSyncedMeta(String(option), value);
    }

    /**
     * Freeze the ped
     */
    function setFrozen() {
        if (!ped.valid) {
            return;
        }

        ped.frozen = true;
    }

    /**
     * This turns off collision, and also freezes the ped
     */
    function setNoCollision() {
        if (!ped.valid) {
            return;
        }

        ped.frozen = true;
        ped.collision = false;
    }

    /**
     * Get closest player to the ped
     *
     * @return {alt.Player}
     */
    function getClosestPlayer(): alt.Player {
        if (!ped.valid) {
            return undefined;
        }

        if (alt.Player.all.length <= 0) {
            return undefined;
        }

        let lastDist = ped.streamingDistance;
        let closest: alt.Player;
        for (let player of alt.Player.all) {
            if (!player || !player.valid) {
                continue;
            }

            const dist = Utility.vector.distance2d(player.pos, ped.pos);
            if (dist > lastDist) {
                continue;
            }

            lastDist = dist;
            closest = player;
        }

        return closest;
    }

    /**
     * Check if the ped is near a position
     *
     * @param {alt.Vector3} position
     * @return
     */
    function isNear(position: alt.Vector3, distance = 2) {
        if (!ped.valid) {
            return false;
        }

        return Utility.vector.distance2d(ped.pos, position) <= distance;
    }

    /**
     * Invoke a native on the ped
     *
     * @template K
     * @param {K} native
     * @param {...Parameters<OmitFirstArg<PedNatives[K]>>} args
     * @return
     */
    function invoke<K extends keyof PedNatives>(native: K, ...args: Parameters<OmitFirstArg<PedNatives[K]>>) {
        if (!ped.valid) {
            return;
        }

        updateNetOwner();

        if (!ped.netOwner || !ped.netOwner.valid) {
            return;
        }

        ped.netOwner.emit(Events.controllers.ped.invoke, native, ped, ...args);
    }

    /**
     * Invoke a native on the ped, and get a result back
     *
     * @template K
     * @param {K} native
     * @param {...Parameters<OmitFirstArg<PedNatives[K]>>} args
     * @return {(Promise<ReturnType<PedNatives[K]> | undefined>)}
     */
    async function invokeRpc<K extends keyof PedNatives>(
        native: K,
        ...args: Parameters<OmitFirstArg<PedNatives[K]>>
    ): Promise<ReturnType<PedNatives[K]> | undefined> {
        if (!ped.valid) {
            return undefined;
        }

        if (!ped.netOwner || !ped.netOwner.valid) {
            return undefined;
        }

        return await ped.netOwner.emitRpc(Events.controllers.ped.invokeRpc, native, ped, ...args);
    }

    /**
     * Listen for when this specific pedestrian dies
     *
     * @param {PedDeathCallback} cb
     */
    function onDeath(cb: PedDeathCallback) {
        callbacks.push(cb);
    }

    /**
     * Kill the pedestrian
     *
     */
    function kill() {
        ped.health = 0;
        invokeDeath(undefined, undefined);
    }

    /**
     * Fade out a pedestrian, and then destroy it
     */
    function fadeOutAndDestroy() {
        if (!ped.valid) {
            return;
        }

        updateNetOwner();

        if (!ped.netOwner || !ped.netOwner.valid) {
            return;
        }

        ped.netOwner.emit(Events.controllers.ped.fadeOut, ped);
        alt.setTimeout(() => {
            if (!ped || !ped.valid) {
                return;
            }

            ped.destroy();
        }, 5000);
    }

    /**
     * Internally handles invoking death on a player, they're removed after 5 seconds
     *
     * This function is called automatically
     *
     * @param {alt.Entity} killer
     * @param {number} weaponHash
     */
    function invokeDeath(killer: alt.Entity, weaponHash: number) {
        ped.health = 0;

        for (let cb of callbacks) {
            cb(uid, killer, weaponHash);
        }

        alt.setTimeout(() => {
            if (!ped.valid) {
                return;
            }

            ped.destroy();
        }, 5000);
    }

    /**
     * set ped dimension
     * @param ped
     * @param dimension
     * @returns
     */
    function setPedDimension(ped: alt.Ped, dimension: number) {
        if (!ped.valid) {
            return;
        }
        ped.dimension = dimension;
    }

    peds.set(uid, {
        fadeOutAndDestroy,
        getClosestPlayer,
        invoke,
        invokeDeath,
        invokeRpc,
        isNear,
        kill,
        onDeath,
        setFrozen,
        setNoCollision,
        setOption,
        setPedDimension,
    });

    return {
        fadeOutAndDestroy,
        getClosestPlayer,
        invoke,
        invokeRpc,
        invokeDeath,
        isNear,
        kill,
        onDeath,
        setFrozen,
        setNoCollision,
        setOption,
        setPedDimension,
    };
}

alt.on('pedDeath', (ped, killer, weaponHash) => {
    const uid = ped.getMeta(sessionKey) as string;
    if (!uid) {
        return;
    }

    if (!peds.has(uid)) {
        return;
    }

    const pedHandler = peds.get(uid);
    pedHandler.invokeDeath(killer, weaponHash);
});

alt.on('removeEntity', (entity: alt.Entity) => {
    if (!(entity instanceof alt.Ped)) {
        return;
    }

    const uid = entity.getMeta(sessionKey) as string;
    if (!uid) {
        return;
    }

    if (!peds.has(uid)) {
        return;
    }

    peds.delete(uid);
});
