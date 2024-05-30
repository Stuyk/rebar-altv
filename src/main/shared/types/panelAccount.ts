import * as Endpoints from '@Server/systems/serverControl/endpoints/index.js';

export type PanelPermission = keyof typeof Endpoints | 'all';
export type PanelPermissions = Array<PanelPermission>;

export type PanelAccount = {
    /**
     * Database Identifier
     *
     * @type {string}
     */
    _id: string;

    /**
     * Username, or email
     *
     * @type {string}
     */
    username: string;

    /**
     * Password for account, hashed
     *
     * @type {string}
     */
    password: string;

    /**
     * Actions this account has access to
     *
     * @type {PanelPermissions}
     */
    actions: PanelPermissions;
};
