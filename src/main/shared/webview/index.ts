import { PLUGIN_IMPORTS } from '../../../../webview/pages/plugins.js';

export type PageType = 'persistent' | 'overlay' | 'page';

export type PageNames = keyof typeof PLUGIN_IMPORTS;
