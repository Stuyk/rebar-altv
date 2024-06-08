import * as alt from 'alt-server';
import { Events } from '../../shared/events/index.js';

const safeEndpoints: {[key: string]: 'GET' | 'POST' } = {};

export function useProxyFetch() {
    /**
     * Register a proxy fetch which can safely be fetched from client-side, and for general usage
     *
     * @param {string} endpoint 
     * @param {('GET' | 'POST')} type 
     */
    function register(endpoint: string, type: 'GET' | 'POST') {
        safeEndpoints[endpoint] = type;
    }

    /**
     * Invoke a proxy fetch
     *
     * @param {string} endpoint 
     * @param {RequestInit} [options] 
     * @return 
     */
    async function fetch(endpoint: string, options?: RequestInit) {
        if (!safeEndpoints[endpoint]) {
            alt.logWarning(`${endpoint} is not registered and is considered an unsafe endpoint`)
        }

        if (!options) {
            options = {};
        }

        options.method = safeEndpoints[endpoint];

        const response = await fetch(endpoint, options);
        if (!response.ok) {
            return undefined;
        }

        try {
            return response.json();
        } catch(err) {
            console.error(err);
        }

        return undefined;
    }

    return {
        fetch,
        register
    }
}

alt.onRpc(Events.systems.proxyFetch.fetch, async (player: alt.Player, endpoint: string, options?: RequestInit) => { 
    return await useProxyFetch().fetch(endpoint, options);
});