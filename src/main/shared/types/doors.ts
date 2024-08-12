import * as alt from 'alt-shared';
import {PermissionOptions} from "@Shared/types/index.js";


export enum DoorState {
    LOCKED = 'locked',
    UNLOCKED = 'unlocked',
}


export interface Door extends PermissionOptions {
    /**
     * Unique identifier for the door.
     * 
     * @type {string}
     */
    uid: string;

    /**
     * Door locked/unlocked state.
     * 
     * @type {DoorState}
     */
    state: DoorState;

    /**
     * Position of the door.
     * 
     * @type {alt.Vector3}
     */
    pos: alt.Vector3;

    /**
     * The hash of the door.
     * 
     * @type {number}
     */
    model: number;
}

export interface DoorsConfig {
    
    /**
     * Door isUnlocked state.
     * 
     * @type {boolean}
     */
    [door: string]: DoorState;
}
