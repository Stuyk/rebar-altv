import { useTranslate } from '../shared/translate.js';

const { setBulk } = useTranslate();

setBulk({
    en: {
        'system.server.started': 'Server Started Successfully',
        'controllers.interaction.message': `Press 'E' to Interact`,
    },
});
