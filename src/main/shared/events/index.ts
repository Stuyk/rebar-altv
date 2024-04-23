export const Events = {
    controllers: {
        interaction: {
            onServer: 'interaction:on:server',
            onClient: 'interaction:on:client',
            clear: 'interaction:on:clear',
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
