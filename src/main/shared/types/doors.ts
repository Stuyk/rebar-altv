import * as alt from 'alt-shared';


export interface Door {
    /**
     * Unique identifier for the door.
     * 
     * @type {string}
     */
    uid: string;

    /**
     * Whether the door is locked or not.
     * 
     * @type {boolean}
     */
    isUnlocked: boolean;

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
    [door: string]: boolean;
}
