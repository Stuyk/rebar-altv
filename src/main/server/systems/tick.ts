import * as alt from 'alt-server';

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:onTick': (tick: number) => void;
    }
}

let lastSecond = new Date(Date.now()).getSeconds();

alt.everyTick(() => {
    const newSecond = new Date(Date.now()).getSeconds();
    if (newSecond === lastSecond) {
        return;
    }

    lastSecond = newSecond;
    alt.emit('rebar:onTick', newSecond);
});
