const translations = {};

type TranslationContext = Record<string, string | number>;

export function useTranslate(lang: string = 'en') {
    /**
     * Replace variables in the translation text
     *
     * @param {string} text The template text with variables {{ var }}
     * @param {TranslationContext} vars The variables to replace in the text
     * @returns {string} The text with the variables replaced
     */
    function replaceVariables(text: string, vars: TranslationContext): string {
        return text.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => vars[key.trim()]?.toString() || '');
    }

    /**
     * Translate text based on key
     *
     * @param {string} key
     * @param context
     * @return
     */
    function t(key: string, context?: TranslationContext) {
        if (!translations[lang]) {
            return `${key} has no translation for '${lang}'`;
        }

        if (!translations[lang][key]) {
            return `${key} has no translation for '${lang}'`;
        }

        return replaceVariables(translations[lang][key], context);
    }

    /**
     * Set a text translation for a given language
     *
     * @param {string} lang 'en', 'fr', etc.
     * @param {string} key 'plugin-name.key-name'
     * @param {string} value 'hello this is plain text'
     */
    function set(lang: string, key: string, value: string) {
        if (!translations[lang]) {
            translations[lang] = {};
        }

        translations[lang][key] = value;
    }

    /**
     * Sets bulk translations, requires language key to be present in translation.
     *
     * @example
     * ```ts
     * {
     *     en: {
     *         'plugin.my-key': 'hello world'
     *     }
     * }
     * ```
     *
     * @param {{ [key: string]: Object }} data
     */
    function setBulk(data: Record<string, Record<string, string>>) {
        for (const lang of Object.keys(data)) {
            if (!translations[lang]) {
                translations[lang] = {};
            }

            for (const key of Object.keys(data[lang])) {
                translations[lang][key] = data[lang][key];
            }
        }
    }

    return {
        t,
        set,
        setBulk,
    };
}
