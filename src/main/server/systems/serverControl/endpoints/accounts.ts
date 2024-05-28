import * as alt from 'alt-server';
import { ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';
import { useRebar } from '../../../index.js';

const Rebar = useRebar();

// http://localhost:3000/accounts
export async function accounts(res: ServerResponse) {
    const onlinePlayers = alt.Player.all.filter((x) => x.valid && Rebar.player.useStatus(x).hasAccount());
    const accountData = onlinePlayers.map((x) => {
        return {
            altvid: x.id,
            pos: x.pos,
            ...Rebar.document.account.useAccount(x).get(),
        };
    });

    sendServerControlResponse(res, 200, accountData);
}
