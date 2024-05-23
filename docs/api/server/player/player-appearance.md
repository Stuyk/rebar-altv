# Appearance

Used to set various freeroam character appearance data and store in the database.

!!!
All functions will automatically save to the database, except for `update`
!!!

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

const appearance = Rebar.player.usePlayerAppearance(somePlayer);

// Get hair decorator for style, and save to database
const hairDecorator = appearance.getHairOverlay(0, 5);

// Set eye color and save to database
appearance.setEyeColor(5);

// Set eyebrow style and save to database
appearance.setEyebrows({ style: 1, color: 5, opacity: 1 });

// Set facial hair style and save to database
appearance.setFacialHair({ style: 5, color: 2, opacity: 1 });

// Set a hair style and save to database
appearance.setHairStyle({ hair: 5, color1: 25, color2: 25, decorator: hairDecorator });

// Set face appearance data
appearance.setHeadBlendData({
    faceFather: 0,
    faceMother: 0,
    skinFather: 5,
    skinMother: 45,
    faceMix: 0.5,
    skinMix: 0.5,
});

// Set to true to have a more feminine body
appearance.setModel(true);

// Set tattoos on the player and save to database
appearance.setTattoos([{ collection: 'mpairraces_overlays', overlay: 'MP_Airraces_Tattoo_000_M' }]);

// Called automatically, but resynchronizes freeroam player appearance
appearance.sync();
```
