import * as alt from 'alt-client';

try {
    alt.loadRmlFont('@rmlui/fonts/inter-regular.ttf', 'inter-regular', false, false);
    alt.loadRmlFont('@rmlui/fonts/inter-black.ttf', 'inter-black', false, true);
    alt.loadRmlFont('@rmlui/fonts/inter-bold.ttf', 'inter-bold', false, true);
} catch (err) {}
