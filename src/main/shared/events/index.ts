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
        },
        textlabel: {
            create: 'textlabel:create',
            destroy: 'textlabel:destroy',
        },
    },
    localPlayer: {
        stats: {
            health: 'localplayer:stats:health',
            armour: 'localplayer:stats:armour',
            speed: 'localplayer:stats:speed',
            weapon: 'localplayer:stats:weapon',
            stamina: 'localplayer:stats:stamina',
            engineOn: 'localplayer:stats:engineon',
            inVehicle: 'localplayer:stats:invehicle',
            inWater: 'localplayer:stats:inwater',
            gear: 'localplayer:stats:gear',
            maxGear: 'localplayer:stats:maxgear',
            vehicleHealth: 'localplayer:stats:vehiclehealth',
            indicatorLights: 'localplayer:stats.indicatorLights',
            ammo: 'localplayer:stats:ammo',
            fps: 'localplayer:stats:fps',
            ping: 'localplayer:stats:ping',
            isTalking: 'localplayer:stats:isTalking',
            time: 'localplayer:stats:time',
            street: 'localplayer:stats:street',
            weather: 'localplayer:stats:weather',
            lights: 'localplayer:stats:lights',
        },
    },
    player: {
        audio: {
            play: {
                local: 'audio:player:sound:2d',
            },
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
    },
};
