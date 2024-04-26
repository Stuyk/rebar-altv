import * as native from 'natives';

/**
 * Create a simple GTA:V Notification.
 *
 *
 * @param {string} text
 */
export function createNotification(text: string): void {
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringPlayerName(text);
    native.endTextCommandThefeedPostTicker(false, true);
}
