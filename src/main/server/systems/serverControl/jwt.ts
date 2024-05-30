import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { useRebar } from '../../index.js';
import { IncomingMessage } from 'http';
import { PanelAccount, PanelPermission } from '../../../shared/types/panelAccount.js';

const SEVEN_DAY_EXPIRATION = 60000 * 60 * 24 * 7;
const Rebar = useRebar();
const db = Rebar.database.useDatabase();

let jwtSecret: string;

type AdminPanel = {
    secret: string;
    expiration: number;
};

async function init() {
    const document = await Rebar.document.global.useGlobal('admin-panel');
    const data = document.get<AdminPanel>();
    if (!data.secret || !data.expiration) {
        jwtSecret = crypto.randomBytes(512).toString('hex');
        await document.setBulk<AdminPanel>({ secret: jwtSecret, expiration: Date.now() + SEVEN_DAY_EXPIRATION });
    }

    if (Date.now() > data.expiration) {
        jwtSecret = crypto.randomBytes(512).toString('hex');
        await document.setBulk<AdminPanel>({ secret: jwtSecret, expiration: Date.now() + SEVEN_DAY_EXPIRATION });
    }

    jwtSecret = data.secret;
}

export function useJwt() {
    function sign(_id: string) {
        return jwt.sign({ _id }, jwtSecret, { expiresIn: Date.now() + SEVEN_DAY_EXPIRATION });
    }

    function decode(token: string) {
        return jwt.verify(token, jwtSecret);
    }

    function getFromHeader(req: IncomingMessage): { _id: string } | undefined {
        if (!req.headers.authorization) {
            return undefined;
        }

        try {
            return jwt.verify(req.headers.authorization, jwtSecret) as { _id: string };
        } catch (err) {
            return undefined;
        }
    }

    async function hasPermission(req: IncomingMessage, permission: PanelPermission) {
        if (!req.headers.authorization) {
            return false;
        }

        let data: { _id: string };

        try {
            data = jwt.verify(req.headers.authorization, jwtSecret) as { _id: string };
        } catch (err) {
            return false;
        }

        if (!data._id) {
            return false;
        }

        const panelAccount = await db.get<PanelAccount>(
            { _id: data._id },
            Rebar.database.CollectionNames.PanelAccounts,
        );
        if (!panelAccount || !panelAccount.actions) {
            return false;
        }

        if (panelAccount.actions.includes('all')) {
            return true;
        }

        return panelAccount.actions.includes(permission);
    }

    return {
        decode,
        getFromHeader,
        hasPermission,
        sign,
    };
}

init();
