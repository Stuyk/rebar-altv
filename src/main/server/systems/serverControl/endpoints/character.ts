import { IncomingMessage, ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';
import { Character } from '../../../../shared/types/character.js';
import { useRebar } from '../../../index.js';

const Rebar = useRebar();
const db = Rebar.database.useDatabase();

export async function character(req: IncomingMessage, res: ServerResponse, data: { _id: string }) {
    const character = await db.get<Character>({ _id: data._id }, Rebar.database.CollectionNames.Characters);
    if (!character) {
        return sendServerControlResponse(res, 400, { message: `Character with specified _id does not exist` });
    }

    return sendServerControlResponse(res, 200, character);
}
