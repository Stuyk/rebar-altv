import * as alt from 'alt-server';
import { useGlobal } from '@Server/document/global.js';
import { objectData } from '@Shared/utility/clone.js';
import { Door, DoorsConfig } from '@Shared/types/index.js';
import { useAccount, useCharacter } from '@Server/document/index.js';
import { distance2d } from '@Shared/utility/vector.js';
import { useEvents } from '@Server/events/index.js';

const config = await useGlobal<DoorsConfig>('doors');
const MAX_DOORS_TO_DRAW = 10;
const streamingDistance = 15;
const doorEntityType = 'door';
const doorGroup = new alt.VirtualEntityGroup(MAX_DOORS_TO_DRAW);
const doors: (Door & { entity: alt.VirtualEntity })[] = [];
const events = useEvents();

/**
 * Door configuration that allows you to get and set the lock state of a door.
 * For internal use only.
 */
function useDoorConfig() {
    function getLockState(uid: string): boolean | undefined {
        return config.getField(uid);
    }

    function setLockState(uid: string, isUnlocked: boolean) {
        config.set(uid, isUnlocked);
        const doorIdx = doors.findIndex((door) => door.uid === uid);
        if (doorIdx === -1) return;
        doors[doorIdx].isUnlocked = isUnlocked;
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

        const isUnlocked = doorConfig.getLockState(door.uid);
        if (typeof isUnlocked === 'undefined') {
            doorConfig.setLockState(door.uid, door.isUnlocked);
        }
        door.isUnlocked = isUnlocked ?? door.isUnlocked;

        const entity = new alt.VirtualEntity(doorGroup, new alt.Vector3(door.pos), streamingDistance, {
            door,
            type: doorEntityType,
        });
        doors.push({ ...door, entity });
    }

    /**
     * Checks if the player has the required permissions to lock/unlock the door.
     * For internal use only.
     * 
     * @param {alt.Player} player
     * @param {Door} door
     * @returns {boolean}
     */
    function checkPermissions(player: alt.Player, door: Door): boolean {
        if (
            !door?.permissions?.character &&
            !door?.permissions?.account &&
            !door?.groups?.account &&
            !door?.groups?.character
        ) {
            return true;
        }
        const rCharacter = useCharacter(player);
        const rAccount = useAccount(player);
        if (!rAccount.isValid() || !rCharacter.isValid()) return false;

        let allowed = false;
        if (door?.permissions?.character) {
            allowed = rCharacter.permissions.hasAnyPermission(door?.permissions?.character ?? []);
        }
        if (door?.permissions?.account) {
            allowed = rAccount.permissions.hasAnyPermission(door?.permissions?.account ?? []);
        }
        if (door?.groups?.character) {
            allowed = rCharacter.groupPermissions.hasAtLeastOneGroupWithSpecificPerm(door?.groups?.character ?? {});
        }
        if (door?.groups?.account) {
            allowed = rAccount.groupPermissions.hasAtLeastOneGroupWithSpecificPerm(door?.groups?.account ?? {});
        }
        return allowed;
    }

    /**
     * Toggles the lock state of a door. If the player has the required permissions, the lock state will be toggled.
     * 
     * @param {alt.Player} player The player that is toggling the lock state.
     * @param {string} uid The uid of the door.
     * @returns {boolean} Whether the lock state was toggled or not.
     */
    function toggleLock(player: alt.Player, uid: string): boolean {
        const door = doors.find((door) => door.uid === uid);
        if (!door) return false;
        if (!checkPermissions(player, door)) return false;

        door.isUnlocked = !door.isUnlocked;
        doorConfig.setLockState(uid, door.isUnlocked);
        events.invoke(door.isUnlocked ? 'door-unlocked' : 'door-locked', uid, player);
        return true;
    }

    /**
     * Forces the lock state of a door. This will bypass any permission checks.
     * 
     * @param {string} uid The uid of the door.
     * @param {boolean} isUnlocked Whether the door is unlocked or not.
     * @returns {boolean} Whether the lock state was set or not.
     */
    function forceSetLock(uid: string, isUnlocked: boolean): boolean {
        const door = doors.find((door) => door.uid === uid);
        if (!door) return false;
        door.isUnlocked = isUnlocked;
        doorConfig.setLockState(uid, door.isUnlocked);
        events.invoke(door.isUnlocked ? 'door-unlocked' : 'door-locked', uid, null);
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

    return { register, toggleLock, forceSetLock, getNearestDoor, getDoor };
}
