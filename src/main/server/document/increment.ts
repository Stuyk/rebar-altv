import { useGlobal } from './global.js';

let incremental: Awaited<ReturnType<typeof useGlobal<{ [key: string]: number }>>>;

async function init() {
    try {
        incremental = await useGlobal('incrementals');
    } catch (err) {}
}

export function useIncrementalId(key: string) {
    async function getNext() {
        return await incremental.increment(key);
    }

    return {
        getNext,
    };
}

init();
