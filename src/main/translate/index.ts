import { useTranslate } from '@Shared/translate.js';

const { setBulk } = useTranslate();

setBulk({
    en: {
        'system.server.started': 'Server Started Successfully',
        'controllers.interaction.message': `Press 'E' to Interact`,
    },
    uk: {
        'system.server.started': 'Сервер успішно запущено',
        'controllers.interaction.message': 'Натисніть \'E\', для взаємодії',
    }
});
