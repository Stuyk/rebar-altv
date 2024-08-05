import * as alt from 'alt-server';
import { useAccount, useCharacter } from '../document/index.js';

export function useStatus(player: alt.Player) {
    function hasAccount() {
        return useAccount(player).isValid();
    }

    function hasCharacter() {
        return useCharacter(player).isValid();
    }

    return {
        hasAccount,
        hasCharacter,
    };
}
