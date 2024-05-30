import * as alt from 'alt-server';
import { IncomingMessage, ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';
import { useRebar } from '../../../index.js';

const Rebar = useRebar();

// http://localhost:3000/characters
export async function characters(req: IncomingMessage, res: ServerResponse) {
    const onlinePlayers = alt.Player.all.filter((x) => x.valid && Rebar.player.useStatus(x).hasCharacter());
    const characterData = onlinePlayers.map((x) => {
        return {
            altvid: x.id,
            pos: x.pos,
            ...Rebar.document.character.useCharacter(x).get(),
        };
    });

    sendServerControlResponse(res, 200, characterData);
}
