import { useTranslate } from '../../../main/shared/translate.js';

const { setBulk } = useTranslate();

setBulk({
    en: {
        'test.translate-from-webview': 'This should be translated via webview',
    },
});
