import * as alt from 'alt-server';

export function useDevReconnect() {
    async function reconnect() {
        if (!process.platform.includes('win')) {
            return;
        }

        const result: Response | undefined = await fetch('http://127.0.0.1:9223/status').catch((err) => {
            return undefined;
        });

        if (typeof result === 'undefined' || !result) {
            return;
        }

        if (alt.getMeta('hotreload')) {
            return;
        }

        await result.text();

        try {
            alt.log('Invoking local reconnection...');
            await fetch('http://127.0.0.1:9223/reconnect');
            alt.log('Local reconnect successful');
        } catch (err) {
            alt.log('Failed to reconnect...');
            alt.setTimeout(reconnect, 1000);
        }
    }

    return {
        reconnect,
    };
}
