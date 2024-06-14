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
        ped: {
            invoke: 'ped:invoke',
            invokeRpc: 'ped:invoke:rpc',
            fadeOut: 'ped:fade:out',
        },
        progressbar: {
            create: 'progressbar:create',
            destroy: 'progressbar:destroy',
        },
        textlabel: {
            create: 'textlabel:create',
            destroy: 'textlabel:destroy',
        },
    },
    events: {
        clientEvents: {
            handle: 'events:client:event:handle',
        },
    },
    localPlayer: {
        stats: {
            set: 'localplayer:stats:set',
        },
    },
    menus: {
        worldmenu: {
            show: 'worldmenu:show',
        },
    },
    player: {
        audio: {
            play: {
                local: 'audio:player:sound:2d',
            },
        },
        controls: {
            set: 'player:controls:set',
        },
        native: {
            invoke: 'player:native:invoke',
        },
        notify: {
            notification: {
                create: 'player:notify:notification:create',
            },
            missiontext: {
                create: 'player:notify:missiontext:create',
            },
            spinner: {
                create: 'player:notify:spinner:create',
                destroy: 'player:notify:spinner:destroy',
            },
            shard: {
                create: 'player:notify:shard:create',
                destroy: 'player:notify:shard:create',
            },
            credits: {
                create: 'player:notify:credits:create',
            },
        },
        webview: {
            set: {
                page: 'player:webview:set:page',
                overlays: 'player:webview:set:overlays',
                persistent: 'player:webview:set:persistent',
            },
        },
    },
    systems: {
        keybinds: {
            update: 'systems:keybinds:update',
            invoke: 'systems:keybinds:invoke',
        },
        messenger: {
            process: 'systems:messenger:process',
            send: 'systems:messenger:send',
        },
        waypoint: {
            get: 'systems:waypoint:get',
        },
        proxyFetch: {
            fetch: 'systems:proxy:fetch',
        },
        raycast: {
            getFocusedEntity: 'systems:raycast:get:focused:entity',
            getFocusedPosition: 'systems:raycast:get:focused:position',
            getFocusedObject: 'systems:raycast:get:focused:object',
        },
        serverConfig: {
            set: 'systems:server:config:set',
        },
        transmitter: {
            execute: 'systems:transmitter:execute',
        },
    },
    view: {
        onServer: 'webview:on:server',
        onEmit: 'webview:emit:on',
        onKeypress: 'webview:emit:keypress',
        emitClientRpc: 'webview:emit:client:rpc',
        emitServerRpc: 'webview:emit:server:rpc',
        emitServer: 'webview:emit:server',
        emitClient: 'webview:emit:client',
        emitReady: 'webview:emit:page:ready',
        show: 'webview:emit:page:show',
        hide: 'webview:emit:page:hide',
        hideAll: 'webview:emit:page:hide:all',
        hideAllByType: 'webview:emit:page:hide:all:type',
        focus: 'webview:emit:focus',
        unfocus: 'webview:emit:unfocus',
        playFrontendSound: 'webview:play:frontend:sound',
        updateMinimap: 'webview:update:minimap',
        localStorageSet: 'webview:localstorage:set',
        localStorageGet: 'webview:localstorage:get',
        localStorageDelete: 'webview:localstorage:delete',
        onPageClose: 'webview:page:close',
        onPageOpen: 'webview:page:open',
    },
};
