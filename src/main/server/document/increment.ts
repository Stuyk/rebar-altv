import { useRebar } from '../index.js';

const Rebar = useRebar();

let incremental: Awaited<ReturnType<typeof Rebar.document.global.useGlobal<{ [key: string]: number }>>>;

async function init() {
    try {
        incremental = await Rebar.document.global.useGlobal('incrementals');
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
