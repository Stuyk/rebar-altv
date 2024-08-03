import * as alt from 'alt-server';
import { useWebview } from '../player/webview.js';
import { useStatus } from '../player/status.js';
import {Events} from '@Shared/events/index.js';
import {Message, PermissionOptions} from '@Shared/types/index.js';
import {useEntityPermissions} from "@Server/systems/permissions/entityPermissions.js";

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:playerSendMessage': (player: alt.Player, msg: string) => void;
        'rebar:playerCommand': (player: alt.Player, commandName: string) => void;
    }
}

export type Command = {
    name: string;
    desc: string;
    options?: PermissionOptions;
    callback: (player: alt.Player, ...args: string[]) => void | boolean | Promise<void> | Promise<boolean>;
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

const commands: Command[] = [];
let endCommandRegistrationTime = Date.now();

export function useMessenger() {
    function registerCommand(command: Command) {
        command.name = command.name.replaceAll('/', '');
        command.name = command.name.toLowerCase();

        const index = commands.findIndex((x) => x.name === command.name);
        if (index >= 1) {
            throw new Error(`${command.name} is already a registered command.`);
        }

        commands.push(command);
        endCommandRegistrationTime = Date.now() + 5000;
    }

    function hasCommandPermission(player: alt.Player, command: Command) {
        return useEntityPermissions(command.options).check(player);
    }

    async function invokeCommand(player: alt.Player, cmdName: string, ...args: any[]): Promise<boolean> {
        cmdName = cmdName.replace('/', '');
        cmdName = cmdName.toLowerCase();

        const index = commands.findIndex((x) => x.name === cmdName);
        if (index <= -1) {
            return false;
        }

        const command = commands[index];
        if (command.options && !hasCommandPermission(player, command)) {
            return false;
        }

        try {
            await command.callback(player, ...args);
            alt.emit('rebar:playerCommand', player, cmdName);
            return true;
        } catch (err) {
            return false;
        }
    }

    function sendMessage(player: alt.Player, message: Message) {
        const webview = useWebview(player);
        webview.emit(Events.systems.messenger.send, message);
    }

    function broadcastMessage(message: Message, options?: PermissionOptions) {
        for (const player of alt.Player.all) {
            if (!options || useEntityPermissions(options).check(player)) {
                sendMessage(player, message);
            }
        }
    }

    /**
     * Get all commands a player has access to, including permissioned commands.
     *
     * @param {alt.Player} player
     */
    async function getCommands(player: alt.Player) {
        await alt.Utils.waitFor(() => Date.now() > endCommandRegistrationTime, 5000);

        const availableCommands: Omit<Command, 'callback' | 'options'>[] = [];
        for (let command of commands) {
            if (!command.options) {
                availableCommands.push({ desc: command.desc, name: command.name });
                continue;
            }

            if (command.options && !hasCommandPermission(player, command)) {
                continue;
            }

            availableCommands.push({ desc: command.desc, name: command.name });
        }

        return availableCommands;
    }

    return {
        commands: {
            invoke: invokeCommand,
            register: registerCommand,
            getCommands: getCommands,
            hasCommandPermission,
        },
        message: {
            send: sendMessage,
            broadcast: broadcastMessage,
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
    if (!player.valid) {
        return;
    }

    if (!useStatus(player).hasCharacter()) {
        return;
    }

    const messageSystem = useMessenger();
    if (msg.charAt(0) !== '/') {
        msg = cleanMessage(msg);
        alt.emit('rebar:playerSendMessage', player, msg);
        return;
    }

    const args = msg.split(' ');
    const commandName = args.shift();
    messageSystem.commands.invoke(player, commandName, ...args);
}

alt.onClient(Events.systems.messenger.process, processMessage);
