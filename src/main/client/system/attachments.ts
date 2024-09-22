import * as alt from 'alt-client';
import { Attachment } from '../../shared/types/attachment.js';

const entityAttachments: { [id: string]: alt.LocalObject[] } = {};

function cleanupAttachments(id: number) {
    if (!entityAttachments[id]) {
        return;
    }

    for (let object of entityAttachments[id]) {
        try {
            object.destroy();
        } catch (err) {}
    }

    delete entityAttachments[id];
}

async function createAttachments(player: alt.Player, attachments: Attachment[]) {
    if (entityAttachments[player.id] && entityAttachments[player.id].length >= 1) {
        cleanupAttachments(player.id);
    }

    entityAttachments[player.id] = [];

    for (let attachment of attachments) {
        if (!attachment.rot) {
            attachment.rot = alt.Vector3.zero;
        }

        const object = new alt.LocalObject(
            attachment.model,
            player.pos,
            new alt.Vector3(attachment.rot),
            true,
            false,
            true,
            15,
        );

        await object.waitForSpawn();

        object.attachToEntity(
            player,
            attachment.bone,
            new alt.Vector3(attachment.offset),
            new alt.Vector3(attachment.rot),
            true,
            false,
            true,
        );

        entityAttachments[player.id].push(object);
    }
}

alt.on('gameEntityCreate', (entity) => {
    if (!(entity instanceof alt.Player)) {
        return;
    }

    if (!entity.hasStreamSyncedMeta('attachments')) {
        return;
    }

    const attachments = entity.getStreamSyncedMeta('attachments');
    if (entityAttachments[entity.id]) {
        cleanupAttachments(entity.id);
    }

    if (attachments.length <= 0) {
        return;
    }

    createAttachments(entity, attachments);
});

alt.on('gameEntityDestroy', (entity) => {
    if (!(entity instanceof alt.Player)) {
        return;
    }

    cleanupAttachments(entity.id);
});

alt.on('streamSyncedMetaChange', (entity: alt.BaseObject, key: string) => {
    if (key !== 'attachments') {
        return;
    }

    if (!(entity instanceof alt.Player)) {
        return;
    }

    if (!entity.hasStreamSyncedMeta('attachments')) {
        return;
    }

    const attachments = entity.getStreamSyncedMeta('attachments');
    if (entityAttachments[entity.id]) {
        cleanupAttachments(entity.id);
    }

    if (attachments.length <= 0) {
        return;
    }

    createAttachments(entity, attachments);
});
