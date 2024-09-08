import * as alt from 'alt-shared';

export interface Attachment {
    uid: string;
    model: string;
    bone: number;
    offset: alt.IVector3;
    rot?: alt.IVector3;
}
