import * as alt from 'alt-server';

export type KeyChangeCallback<T = alt.Player> = (entity: T, newValue: any, oldValue: any) => void;

export const CollectionNames = {
    Accounts: 'Accounts',
    Characters: 'Characters',
    Vehicles: 'Vehicles',
    Global: 'Global',
};
