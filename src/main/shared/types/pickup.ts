import * as alt from 'alt-shared';
import { PickupTypes } from '../data/pickups.js';

export type WeaponPickup = {
    uid?: string;
    pickup: PickupTypes;
    pos: alt.IVector3;
    dimension?: number;
};
