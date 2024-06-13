import * as alt from 'alt-shared';

export interface WorldMenu {
    pos: alt.Vector3;
    title: string;
    options: { name: string; event: string; args?: any }[];
}
