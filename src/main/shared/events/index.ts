export const Events = {
    controllers: {
        interaction: {
            set: 'interaction:set:interact',
            trigger: 'interaction:trigger',
            clear: 'interaction:on:clear',
        },
        interactionLocal: {
            create: 'interaction:local:create',
            destroy: 'interaction:local:destroy',
            onEnter: 'interaction:local:onEnter',
            onLeave: 'interaction:local:onLeave',
            on: 'interaction:local:on',
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
        dxgilabel: {
            create: 'dxgilabel:create',
            destroy: 'dxgilabel:destroy',
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
            stop: {
                local: 'udio:player:sound:2d:stop',
            },
        },
        controls: {
            set: 'player:controls:set',
            setCameraFrozen: 'player:controls:setFrozen',
            setAttackControlsDisabled: 'player:controls:set:attack:disabled',
            setCameraControlsDisabled: 'player:controls:set:disabled',
        },
        native: {
            invoke: 'player:native:invoke',
            invokeWithResult: 'player:native:invoke:with:result',
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
        screen: {
            ped: {
                show: 'player:show:ped:on:screen',
            },
            instructionalButtons: {
                create: 'player:screen:instructionalButtons:create',
                destroy: 'player:screen:instructionalButtons:destroy',
                get: 'player:screen:instructionalButtons:get',
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
        world: {
            pointDetails: 'systems:world:pointDetails',
            travelDistance: 'systems:world:routeLength',
        },
        keybinds: {
            update: 'systems:keybinds:update',
            invoke: 'systems:keybinds:invoke',
        },
        keypress: {
            update: 'systems:keypress:update',
            invokeUp: 'systems:keypress:invoke:keyup',
            invokeDown: 'systems:keypress:invoke:keydown',
            invokeHold: 'systems:keypress:invoke:keyhold',
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
            getFocusedCustom: 'systems:raycast:get:focused:custom',
        },
        screenshot: {
            get: 'systems:screenshot:get',
            take: 'systems:screenshot:take',
            takeVehicle: 'systems:screen:take:vehicle',
            takeWeapon: 'systems:screen:take:weapon',
            setClothing: 'systems:screen:set:clothing',
        },
        serverConfig: {
            set: 'systems:server:config:set',
        },
        transmitter: {
            execute: 'systems:transmitter:execute',
        },
    },
    vehicle: {
        set: {
            rpm: 'vehicle:set:rpm',
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
        syncCharacter: 'webview:sync:character',
        syncPartialCharacter: 'webview:sync:partial:character',
        syncVehicle: 'webview:sync:vehicle',
        syncPartialVehicle: 'webview:sync:partial:vehicle',
    },
};
