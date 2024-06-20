import { useRebar } from '../index.js';

const Rebar = useRebar();

let incremental: Awaited<ReturnType<typeof Rebar.document.global.useGlobal>>;

async function init() {
    incremental = await Rebar.document.global.useGlobal('incrementals');
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
