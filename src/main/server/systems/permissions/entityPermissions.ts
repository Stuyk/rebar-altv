import * as alt from 'alt-server';
import {PermissionOptions} from "@Shared/types/index.js";
import {useAccount, useCharacter} from "@Server/document/index.js";


export function useEntityPermission<T extends PermissionOptions>(entity: T) {
    function check(player: alt.Player, returnOnFirstMatch: boolean = true): boolean {
        if (
            !entity?.permissions?.character &&
            !entity?.permissions?.account &&
            !entity?.groups?.account &&
            !entity?.groups?.character
        ) {
            return true;
        }
        const rCharacter = useCharacter(player);
        const rAccount = useAccount(player);
        if (!rAccount.isValid() || !rCharacter.isValid()) return false;

        let allowed = false;
        if (entity?.permissions?.character) {
            allowed = rCharacter.permissions.hasAnyOf(entity?.permissions?.character ?? []);
        }

        if (entity?.permissions?.account) {
            allowed = rAccount.permissions.hasAnyOf(entity?.permissions?.account ?? []);
        }

        if (entity?.groups?.account) {
            allowed = entity.groups.account.some((group) => rAccount.groups.memberOf(group));
        }

        if (entity?.groups?.character) {
            allowed = entity.groups.character.some((group) => rCharacter.groups.memberOf(group));
        }

        return allowed;
    }

    return {check};
}
