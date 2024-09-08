import * as alt from 'alt-shared';


export enum DoorState {
    LOCKED = 'locked',
    UNLOCKED = 'unlocked',
}


export interface Door {
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

    /**
     * The permissions that are allowed to lock/unlock the door.
     * 
     * @type {Record<'account' | 'character', string[]>}
     */
    permissions: {
        account: string[];
        character: string[];
    }

    /**
     * The groups that are allowed to lock/unlock the door.
     * 
     * @type {Record<string, string[]>}
     */
    groups: {
        account: {
            [key: string]: string[];
        };
        character: {
            [key: string]: string[];
        };
    }
}

export interface DoorsConfig {
    
    /**
     * Door isUnlocked state.
     * 
     * @type {boolean}
     */
    [door: string]: DoorState;
}
