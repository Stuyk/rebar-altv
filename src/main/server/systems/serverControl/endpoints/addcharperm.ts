import * as alt from 'alt-server';
import { IncomingMessage, ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';
import { Character } from '../../../../shared/types/character.js';
import { useRebar } from '../../../index.js';

const Rebar = useRebar();
const db = Rebar.database.useDatabase();

export async function addCharPerm(
    req: IncomingMessage,
    res: ServerResponse,
    data: { _id: string; permission: string },
) {
    if (!data._id || !data.permission) {
        return sendServerControlResponse(res, 400, {
            message: '_id or permission was not provided as url parameters',
        });
    }

    const onlinePlayers = alt.Player.all.filter((x) => x.valid && Rebar.player.useStatus(x).hasCharacter());
    const player = onlinePlayers.find((x) => Rebar.document.character.useCharacter(x).getField('_id') === data._id);
    if (!player) {
        const character = await db.get<Character>({ _id: data._id }, Rebar.database.CollectionNames.Characters);
        if (!character) {
            return sendServerControlResponse(res, 400, { message: `Character with specified _id does not exist` });
        }

        const perms = character.permissions ?? [];
        if (perms.includes(data.permission)) {
            return sendServerControlResponse(res, 400, { message: 'Permission already exists on the character' });
        }

        perms.push(data.permission);
        const result = await db.update<Partial<Character>>(
            { _id: character._id, permissions: perms },
            Rebar.database.CollectionNames.Characters,
        );

        if (!result) {
            return sendServerControlResponse(res, 400, { message: 'Failed to add permission' });
        }

        return sendServerControlResponse(res, 200, { message: `Added permission successfully` });
    }

    const character = Rebar.document.character.useCharacter(player);
    const perms = character.getField('permissions') ?? [];
    if (perms.includes(data.permission)) {
        return sendServerControlResponse(res, 400, { message: 'Permission already exists on the character' });
    }

    perms.push(data.permission);
    await character.set('permissions', perms);
    return sendServerControlResponse(res, 200, { message: `Added permission successfully` });
}
