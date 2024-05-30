import { IncomingMessage, ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';
import { PanelAccount, PanelPermission } from '@Shared/types/panelAccount.js';
import { useRebar } from '../../../index.js';
import * as Password from '@Server/utility/password.js';
import { useJwt } from '../jwt.js';

const Rebar = useRebar();
const db = Rebar.database.useDatabase();
const jwt = useJwt();

// http://localhost:3000/register
export async function register(
    req: IncomingMessage,
    res: ServerResponse,
    data: { username: string; password: string; permissions: PanelPermission[] },
) {
    if (!data.username || !data.password || !data.permissions) {
        return sendServerControlResponse(res, 400, { message: `Did not provide username, password, or permissions` });
    }

    const accounts = await db.getAll<PanelAccount>(Rebar.database.CollectionNames.PanelAccounts);
    if (accounts.find((x) => x.username === data.username)) {
        return sendServerControlResponse(res, 400, {
            message: `Username already exists`,
        });
    }

    // Register first Admin Panel account
    if (accounts.length >= 1) {
        const hasPerm = await jwt.hasPermission(req, 'register');
        if (!hasPerm) {
            return sendServerControlResponse(res, 401, {
                message: `Unauthorized`,
            });
        }
    }

    // Create account
    const _id = await db.create<Omit<PanelAccount, '_id'>>(
        {
            username: data.username,
            password: Password.hash(data.password),
            actions: accounts.length <= 0 ? ['all'] : data.permissions,
        },
        Rebar.database.CollectionNames.PanelAccounts,
    );

    if (!_id) {
        return sendServerControlResponse(res, 400, {
            message: `Could not create account, is database accessible?`,
        });
    }

    return sendServerControlResponse(res, 200, { message: `Account created, try logging in next` });
}
