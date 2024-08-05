import { useGlobal } from './global.js';

let incremental: Awaited<ReturnType<typeof useGlobal<{ [key: string]: number }>>>;

async function init() {
    try {
        incremental = await useGlobal('incrementals');
    } catch (err) {}
}

export function useIncrementalId(key: string) {
    async function getNext() {
        const value: number = incremental.getField(key) ?? 0;
        await incremental.set(key, value + 1);
        return value + 1;
    }

    return {
        getNext,
    };
}

init();
