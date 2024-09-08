import * as alt from 'alt-server';
import { Account } from '@Shared/types/account.js';
import { Character } from '@Shared/types/character.js';
import { Vehicle } from '@Shared/types/vehicle.js';
import { Weathers } from '@Shared/data/weathers.js';
import { PageNames } from '../../shared/webview/index.js';
import { Events } from '../../shared/events/index.js';

declare global {
    export interface RebarEvents {
        'weather-forecast-changed': (weather: Weathers[]) => void;
        'weather-changed': (weather: Weathers) => void;
        'time-changed': (hour: number, minute: number, second: number) => void;
        'time-second-changed': (minute: number) => void;
        'time-minute-changed': (minute: number) => void;
        'time-hour-changed': (hour: number) => void;
        'account-bound': (player: alt.Player, document: Account) => void;
        'character-bound': (player: alt.Player, document: Character) => void;
        'vehicle-bound': (vehicle: alt.Vehicle, document: Vehicle) => void;
        'page-closed': (player: alt.Player, page: PageNames) => void;
        'page-opened': (player: alt.Player, page: PageNames) => void;
        'door-locked': (uid: string, initiator: alt.Player) => void;
        'door-unlocked': (uid: string, initiator: alt.Player | null) => void;
        'on-command': (player: alt.Player, commandName: string) => void;
        message: (player: alt.Player, message: string) => void;
    }
}

type EventCallbacks<K extends keyof RebarEvents> = { [key in K]: RebarEvents[K][] };

const eventCallbacks: Partial<EventCallbacks<keyof RebarEvents>> = {};

export function useEvents() {
    function on<K extends keyof RebarEvents>(event: K, callback: RebarEvents[K]) {
        if (!eventCallbacks[event]) {
            eventCallbacks[event] = [];
        }

        eventCallbacks[event].push(callback);
    }

    function invoke<K extends keyof RebarEvents>(event: K, ...args: Parameters<RebarEvents[K]>) {
        if (!eventCallbacks[event]) {
            return;
        }

        for (let cb of eventCallbacks[event]) {
            // Normally I would not do this but I know this works, and TypeScript is being a jerk.
            // @ts-ignore
            cb(...args);
        }
    }

    return {
        invoke,
        on,
    };
}

// Listens for when a page is opened
alt.onClient(Events.view.onPageOpen, (player: alt.Player, pageName: PageNames) =>
    useEvents().invoke('page-opened', player, pageName),
);

// Listens for when a page is closed
alt.onClient(Events.view.onPageClose, (player: alt.Player, pageName: PageNames) =>
    useEvents().invoke('page-closed', player, pageName),
);
