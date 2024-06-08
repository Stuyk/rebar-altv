import * as alt from 'alt-client';
import { Events } from '../../shared/events/index.js';

export function useProxyFetch() {
    async function fetch<T = Object>(endpoint: string, options?: RequestInit): Promise<T | undefined> {
        return await alt.emitRpc(Events.systems.proxyFetch.fetch, endpoint, options);
    }   

    return {
        fetch
    }
}