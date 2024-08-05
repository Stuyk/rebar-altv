import * as alt from 'alt-server';
import { useAccount } from '../document/account.js';

type RateLimitTracker = { nextCall: number; violations: 0 };

/**
 * Protect an event, or callback with rate limits.
 *
 * Prevents the callback from being invoked too fast and too often.
 *
 * If they violate too often, they'll be kicked from the server.
 *
 * @export
 * @param {Function} callback
 * @param {string} uid
 * @param {number} timeBetweenCalls
 * @return
 */
export function useRateLimitCallback(callback: Function, uid: string, timeBetweenCalls: number) {
    return (player: alt.Player, ...args: any[]) => {
        const rateLimitTracker = (player.getMeta(`function-${uid}`) as RateLimitTracker) ?? {
            nextCall: 0,
            violations: 0,
        };

        // Invoke the callback, because its within range
        if (rateLimitTracker.nextCall < Date.now()) {
            rateLimitTracker.nextCall = Date.now() + timeBetweenCalls;
            player.setMeta(`function-${uid}`, rateLimitTracker);
            callback(player, ...args);
            return;
        }

        rateLimitTracker.violations += 1;
        player.setMeta(`function-${uid}`, rateLimitTracker);

        if (rateLimitTracker.violations < 10) {
            return;
        }

        const document = useAccount(player);

        if (!document.get()) {
            alt.logWarning(`Player ID | ${player.id} called ${uid} too fast, they were kicked`);
            player.kick(`Kicked for violating callback rate limits`);
            return;
        }

        alt.logWarning(
            `Account _id | ${document.getField(
                '_id',
            )} called ${uid} too fast, they were kicked for violating callback limits`,
        );
        player.kick(`Kicked for violating callback rate limits`);
        return;
    };
}
