export const Events = {
    controllers: {
        interaction: {
            set: 'interaction:set:interact',
            trigger: 'interaction:trigger',
            clear: 'interaction:on:clear',
        },
        blip: {
            create: 'blip:create',
            destroy: 'blip:destroy',
        },
        marker: {
            create: 'marker:create',
            destroy: 'marker:destroy',
        },
        object: {
            create: 'object:create',
            destroy: 'object:destroy',
        },
        textlabel: {
            create: 'textlabel:create',
            destroy: 'textlabel:destroy',
        },
    },
    view: {
        onServer: 'webview:on:server',
        onEmit: 'webview:emit:on',
        emitServer: 'webview:emit:server',
        emitClient: 'webview:emit:client',
        emitReady: 'webview:emit:page:ready',
        show: 'webview:emit:page:show',
        hide: 'webview:emit:page:hide',
        hideAll: 'webview:emit:page:hide:all',
        hideAllByType: 'webview:emit:page:hide:all:type',
    },
};
