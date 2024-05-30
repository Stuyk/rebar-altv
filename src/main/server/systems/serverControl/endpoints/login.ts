import { IncomingMessage, ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';
import { PanelAccount } from '../../../../shared/types/panelAccount.js';
import { useRebar } from '../../../index.js';
import * as Password from '@Server/utility/password.js';
import { useJwt } from '../jwt.js';

const Rebar = useRebar();
const db = Rebar.database.useDatabase();
const jwt = useJwt();

// http://localhost:3000/login
export async function login(req: IncomingMessage, res: ServerResponse, data: { username: string; password: string }) {
    if (!data.username || !data.password) {
        return sendServerControlResponse(res, 400, { message: `Did not provide username or password` });
    }

    const accounts = await db.getMany<PanelAccount>(
        { username: data.username },
        Rebar.database.CollectionNames.PanelAccounts,
    );
    if (accounts.length <= 0) {
        return sendServerControlResponse(res, 400, {
            message: `Username or password was incorrect`,
        });
    }

    if (!Password.check(data.password, accounts[0].password)) {
        return sendServerControlResponse(res, 400, {
            message: `Username or password was incorrect`,
        });
    }

    // Account is correct, create JWT information
    return sendServerControlResponse(res, 200, { token: jwt.sign(accounts[0]._id) });
}
