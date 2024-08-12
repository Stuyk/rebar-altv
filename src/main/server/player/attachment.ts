import * as alt from 'alt-server';
import {Attachment} from '@Shared/types/index.js';

declare module 'alt-shared' {
    export interface ICustomEntityStreamSyncedMeta {
        attachments: Attachment[];
    }
}

export function useAttachment(player: alt.Player) {
    /**
     * Attach an object to a player based on bone index
     *
     * @param {Attachment} attachment
     */
    function add(attachment: Attachment) {
        let attachments = player.getStreamSyncedMeta('attachments');
        if (!attachments) {
            attachments = [];
        }

        const index = attachments.findIndex((x) => x.uid === attachment.uid);
        if (index <= -1) {
            attachments.push(attachment);
        } else {
            attachments[index] = attachment;
        }

        player.setStreamSyncedMeta('attachments', attachments);
    }

    /**
     * Remove an object from a player based on uid
     *
     * @param {string} uid
     * @return
     */
    function remove(uid: string) {
        let attachments = player.getStreamSyncedMeta('attachments');
        if (!attachments) {
            return;
        }

        const index = attachments.findIndex((x) => x.uid === uid);
        if (index >= 0) {
            attachments.splice(index, 1);
        }

        player.setStreamSyncedMeta('attachments', attachments);
    }

    return {
        add,
        remove,
    };
}
