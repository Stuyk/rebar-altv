import * as alt from 'alt-server';
import { useRebar } from '../index.js';

const Rebar = useRebar();

export function useStatus(player: alt.Player) {
    function hasAccount() {
        return Rebar.document.account.useAccount(player).isValid();
    }

    function hasCharacter() {
        return Rebar.document.character.useCharacter(player).isValid();
    }

    return {
        hasAccount,
        hasCharacter,
    };
}
