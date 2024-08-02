import * as alt from 'alt-server';
import { useGlobal } from '@Server/document/global.js';
import { objectData } from '@Shared/utility/clone.js';
import { Door, DoorsConfig, DoorState } from '@Shared/types/index.js';
import { distance2d } from '@Shared/utility/vector.js';
import {useEntityPermissions} from "@Server/systems/permissions/entityPermissions.js";

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:doorLocked': (uid: string, initiator: alt.Player) => void;
        'rebar:doorUnlocked': (uid: string, initiator: alt.Player | null) => void;
    }
}

const config = await useGlobal<DoorsConfig>('doors');
const MAX_DOORS_TO_DRAW = 10;
const streamingDistance = 15;
const doorEntityType = 'door';
const doorGroup = new alt.VirtualEntityGroup(MAX_DOORS_TO_DRAW);
const doors: (Door & { entity: alt.VirtualEntity })[] = [];

/**
 * Door configuration that allows you to get and set the lock state of a door.
 * For internal use only.
 */
function useDoorConfig() {
    /**
     * Gets the lock state of a door.
     *
     * @param {string} uid The uid of the door.
     * @returns {DoorState | undefined} The state of the door in the DB.
     */
    function getLockState(uid: string): DoorState | undefined {
        return config.getField(uid);
    }

    /**
     * Sets the lock state of a door.
     *
     * @param {string} uid The uid of the door.
     * @param {DoorState} state The state of the door.
     * @returns {void}
     */
    function setLockState(uid: string, state: DoorState): void {
        config.set(uid, state);
        const doorIdx = doors.findIndex((door) => door.uid === uid);
        if (doorIdx === -1) {
            return;
        }

        doors[doorIdx].state = state;
        doors[doorIdx].entity.setStreamSyncedMeta('door', objectData(doors[doorIdx]));
    }

    return { getLockState, setLockState };
}

/**
 * Door controller that allows you to register doors and toggle their lock state.
 */
export function useDoor() {
    const doorConfig = useDoorConfig();

    /**
     * Registers a door to the door controller. This will create a virtual entity for the door.
     * The door will be streamed to all players within the streaming distance.
     *
     * @param {Door} door
     * @returns {void}
     */
    function register(door: Door): void {
        if (doors.find((d) => d.uid === door.uid)) {
            throw new Error(`Door with uid ${door.uid} already exists. Please make sure all doors have unique uids.`);
        }

        const state = doorConfig.getLockState(door.uid);
        if (typeof state === 'undefined') {
            doorConfig.setLockState(door.uid, door.state);
        }

        door.state = state ?? door.state ?? DoorState.UNLOCKED;

        const entity = new alt.VirtualEntity(doorGroup, new alt.Vector3(door.pos), streamingDistance, {
            door,
            type: doorEntityType,
        });
        doors.push({ ...door, entity });
    }

    function getNextState(state: DoorState): DoorState {
        return state === DoorState.LOCKED ? DoorState.UNLOCKED : DoorState.LOCKED;
    }

    /**
     * Toggles the lock state of a door. If the player has the required permissions, the lock state will be toggled.
     *
     * @param {alt.Player} player The player that is toggling the lock state.
     * @param {string} uid The uid of the door.
     * @returns {boolean} Whether the lock state was toggled or not.
     */
    function toggleLockState(player: alt.Player, uid: string): boolean {
        const door = doors.find((door) => door.uid === uid);
        if (!door) return false;
        if (!useEntityPermissions(door).check(player)) return false;

        door.state = getNextState(door.state);
        doorConfig.setLockState(uid, door.state);
        alt.emit(door.state === DoorState.LOCKED ? 'rebar:doorLocked' : 'rebar:doorUnlocked', uid, player);
        return true;
    }

    /**
     * Forces the lock state of a door. This will bypass any permission checks.
     *
     * @param {string} uid The uid of the door.
     * @param {DoorState} state Whether the door is unlocked or not.
     * @returns {boolean} Whether the lock state was set or not.
     */
    function forceSetLockState(uid: string, state: DoorState): boolean {
        const door = doors.find((door) => door.uid === uid);
        if (!door) {
            return false;
        }

        door.state = state;
        doorConfig.setLockState(uid, door.state);
        alt.emit(door.state === DoorState.LOCKED ? 'rebar:doorLocked' : 'rebar:doorUnlocked', uid, null);
        return true;
    }

    /**
     * Gets the nearest door to the player.
     *
     * @param {alt.Player} player Player to get the nearest door to.
     * @returns {Promise<Door | undefined>} The nearest door to the player.
     */
    async function getNearestDoor(player: alt.Player): Promise<Door | undefined> {
        let lastDistance = streamingDistance;
        let closestTarget: Door | undefined = undefined;
        for (const door of doors) {
            const dist = distance2d(player.pos, door.pos);
            if (dist > lastDistance) continue;
            lastDistance = dist;
            closestTarget = door;
        }
        return closestTarget;
    }

    /**
     * Gets a door by its uid.
     *
     * @param {string} uid Door uid to get.
     * @returns {Door | undefined} The door with the specified uid.
     */
    function getDoor(uid: string): Door | undefined {
        return doors.find((door) => door.uid === uid);
    }

    return { register, toggleLockState, forceSetLockState, getNearestDoor, getDoor };
}
