import * as alt from 'alt-server';
import { useRebar } from '../index.js';
import { Events } from '../../shared/events/index.js';
import { Message } from '../../shared/types/message.js';

export type PlayerMessageCallback = (player: alt.Player, msg: string) => void;

export type CommandOptions = {
    permissions?: string[];
    accountPermissions?: string[];
};

export type Command = {
    name: string;
    desc: string;
    options?: CommandOptions;
    callback: (player: alt.Player, ...args: any[]) => void | boolean;
};

const tagOrComment = new RegExp(
    '<(?:' +
        // Comment body.
        '!--(?:(?:-*[^->])*--+|-?)' +
        // Special "raw text" elements whose content should be elided.
        '|script\\b' +
        '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*' +
        '>[\\s\\S]*?</script\\s*' +
        '|style\\b' +
        '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*' +
        '>[\\s\\S]*?</style\\s*' +
        // Regular name
        '|/?[a-z]' +
        '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*' +
        ')>',
    'gi',
);

const Rebar = useRebar();

const commands: Command[] = [];
const callbacks: PlayerMessageCallback[] = [];

export function useMessenger() {
    function registerCommand(command: Command) {
        const index = commands.findIndex((x) => x.name === command.name);
        if (index >= 1) {
            throw new Error(`${command.name} is already a registered command.`);
        }

        command.name = command.name.replaceAll('/', '');
        commands.push(command);
    }

    function onMessage(cb: PlayerMessageCallback) {
        callbacks.push(cb);
    }

    function invokeCommand(player: alt.Player, cmdName: string, ...args: any[]): boolean {
        const index = commands.findIndex((x) => x.name === cmdName);
        if (index <= -1) {
            return false;
        }

        const command = commands[index];
        if (command.options) {
            const permissions = Rebar.permission.usePermission(player);

            let allValid = true;
            if (command.options.accountPermissions) {
                allValid = permissions.hasOne('account', command.options.accountPermissions);
            }

            if (command.options.permissions) {
                allValid = permissions.hasOne('character', command.options.permissions);
            }

            if (!allValid) {
                return false;
            }
        }

        try {
            command.callback(player, ...args);
            return true;
        } catch (err) {
            return false;
        }
    }

    function sendMessage(player: alt.Player, message: Message) {
        const webview = Rebar.player.useWebview(player);
        webview.emit(Events.systems.messenger.send, message);
    }

    return {
        commands: {
            invoke: invokeCommand,
            register: registerCommand,
        },
        message: {
            on: onMessage,
            send: sendMessage,
        },
    };
}

/**
 * Removes HTML brackets, and other escaped garbage.
 *
 * @param {string} msg
 * @return {string}
 */
function cleanMessage(msg: string): string {
    return msg
        .replace(tagOrComment, '')
        .replace('/</g', '&lt;')
        .replace('/', '')
        .replace(/<\/?[^>]+(>|$)/gm, '');
}

/**
 * Process a command sent up from the client
 *
 * @param {alt.Player} player
 * @param {string} msg
 * @return
 */
function processMessage(player: alt.Player, msg: string) {
    const messageSystem = useMessenger();
    msg = cleanMessage(msg);

    if (msg.charAt(0) !== '/') {
        for (let cb of callbacks) {
            cb(player, msg);
        }

        return;
    }

    const args = msg.split(' ');
    const commandName = args.shift();
    messageSystem.commands.invoke(player, commandName.toLowerCase(), args);
}

alt.onClient(Events.systems.messenger.process, processMessage);
