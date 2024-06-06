import * as alt from 'alt-server';
import { Events } from '../shared/events/index.js';

export async function initLockerPlugins() {
    const resources = alt.getAllResources().filter(x => x.name.includes('rebar-'));
    const promises: Promise<{ loaded: boolean, name: string}>[] = [];
    for(let resource of resources) {
        promises.push(new Promise(async (resolve: Function) => {
            try {
                await import(`../../../${resource.name}/server/index.js`)
                resolve({ loaded: true, name: resource.name })
            } catch(err) {
                resolve({ loaded: false, name: resource.name })
            }
        }));
    }

    alt.log('~c~:: Loading Locker Plugins');
    const results = await Promise.all(promises);
    for(let result of results) {
        if (result) {
            alt.log(`~c~> ${result.name}`)
            continue;
        }

        alt.log(`~r~::: Locker Plugin Failed To Load: ${result.name}`);
    }
    alt.log('~c~:: Locker Plugins Loaded');
}

function handleClientLocker(player: alt.Player) {
    const resources = alt.getAllResources().filter(x => x.name.includes('rebar-'));
    for(let resource of resources) {
        player.emit(Events.locker.inject, resource.name);
    }
}

export function useLocker() {
    


}

alt.on('playerConnect', handleClientLocker);