# Clothing

All of these functions can be used to adjust character clothing, skins, and uniforms.

Keep in mind that the render order is as follows.

1. If a skin is present we set the skin, and do nothing else.
2. If a skin is not present, we apply the clothes to the freeroam model
3. If a uniform is present, we apply the uniform to the freeroam model

Uniform will always be rendered last and will override clothing pieces.

!!!
All functions will automatically save to the database, except for `update`
!!!

```ts
import { useClothing } from '@Server/player/clothing.js';

const clothing = useClothing(somePlayer);

// Set skin to something other than a freemode ped
clothing.setSkin('u_f_y_bikerchic');

// Clear skin, and reset to default freemode ped
clothing.clearSkin();

// Set uniform applies clothing to a character after their clothing is set, essentially overriding what they are wearing
clothing.setUniform([
    { dlc: alt.hash('some_dlc'), drawable: 0, id: 5, texture: 0 },
    { dlc: alt.hash('some_dlc'), drawable: 1, id: 6, texture: 0 },
    { dlc: alt.hash('some_dlc'), drawable: 7, id: 2, texture: 0 },
]);

// Clear uniform, this should be obvious
clothing.clearUniform();

// Set clothing and prop components and override everything
clothing.setClothing([
    { dlc: alt.hash('some_dlc'), drawable: 0, id: 5, texture: 0 },
    { dlc: alt.hash('some_dlc'), drawable: 1, id: 6, texture: 0 },
    { dlc: alt.hash('some_dlc'), drawable: 7, id: 2, texture: 0 },
]);

// Clear clothing removes all clothing and resets to default clothing values
clothing.clearClothing();

// This will remove a specific clothing component
clothing.removeClothingComponent('shoes');
clothing.removeClothingComponent('mask');

// This will use a dlc hash for the clothing component
clothing.setClothingComponent('mask', alt.hash('some_dlc'), 5, 0, 0);
clothing.setPropComponent('glasses', alt.hash('some_dlc'), 5, 0);

// Forces character clothing to update, and rerenders everything
clothing.update();
```
