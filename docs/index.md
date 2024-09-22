---
order: 99
---

# What is Rebar?

Rebar is a plugin-based framework for GTA:V based on alt:V that focuses on server-side functionality to control almost all player aspects. Rebar provides a robust starting point for any game mode as you'll be able to choose from a wide variety of community plugins to install. Rebar thrives with its welcoming Discord community, community contributions, and plugins.

Rebar stops server developers from spending years building boilerplate code, and instead gets them straight to writing their game mode.

## Tech Stack

-   Node.js
-   TypeScript
-   MongoDB
-   Vue

## Why the name Rebar?

Rebar is the foundational piece necessary to construct large concrete structures. Think of this framework as achieving the same from a game mode standpoint.

## Rebar vs Fivem (ESX, QBCore)

While ESX, and QBCore have been around forever, Rebar handles all the heavy lifting for you.

+++ Keybind Example
||| FiveM

```lua
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)

        if IsControlJustPressed(1, 51) then
            print("E key was pressed!")
        end
    end
end)
```

||| Rebar

```ts
Keybinder.on(75, (player) => {
    console.log('Pressed k');
});
```

|||
+++ Ped Example
||| FiveM

```lua
local pedModel = "a_m_y_hipster_01"
local spawnCoords = vector3(427.13, -806.46, 29.49)
local targetCoords = vector3(435.0, -800.0, 29.49)

function loadModel(model)
    RequestModel(model)
    while not HasModelLoaded(model) do
        Citizen.Wait(0)
    end
end

Citizen.CreateThread(function()
    loadModel(GetHashKey(pedModel))
    local ped = CreatePed(4, GetHashKey(pedModel), spawnCoords.x, spawnCoords.y, spawnCoords.z, 0.0, true, false)
    TaskGoStraightToCoord(ped, targetCoords.x, targetCoords.y, targetCoords.z, 1.0, -1, 0.0, 0.0)
    SetEntityInvincible(ped, true)
end)
```

||| Rebar

```ts
const pedModel = 'a_m_y_hipster_01'; // The pedestrian model
const spawnCoords = { x: 427.13, y: -806.46, z: 29.49 }; // Spawn coordinates
const targetCoords = { x: 435.0, y: -800.0, z: 29.49 }; // Target coordinates

const ped = Rebar.controllers.usePed(new alt.Ped(pedModel, spawnCoords, alt.Vector3.zero));

ped.setOption('makeStupid', true);
ped.setOption('invincible', true);

ped.invoke('taskGoStraightToCoord', targetCoords.x, targetCoords.y, targetCoords.z, 1.0, -1, 0, 0);
```

|||

+++ Text Example
||| FiveM

```lua
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        local x, y, z = 427.13, -806.46, 29.49
        local text = "Hello, World!"
        local scale = 0.5
        local color = {255, 255, 255, 255}

        SetTextFont(0)
        SetTextProportional(1)
        SetTextScale(scale, scale)
        SetTextColour(color[1], color[2], color[3], color[4])
        SetTextEntry("STRING")
        AddTextComponentString(text)
        DrawText(x, y)
    end
end)

```

||| Rebar

```ts
const label = Rebar.controllers.useD2DTextLabel({
    text: 'Hello World',
    pos: new alt.Vector3(427.13, -806.46, 29.49),
    fontColor: new alt.RGBA(255, 255, 255, 255),
    fontSize: 0.5,
});
```

|||
+++

## Getting Started

### Experienced Developers

Head on over to [Install & Upgrade](./install.md) to learn about the installation process.

### New Developers

Head on over to the [book on Rebar](./tutorials/rebar/chapter-01-preface.md) and how to utilize it. There's even a few small tutorials on programming.
