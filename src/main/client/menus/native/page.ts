import * as alt from 'alt-client';
import * as native from 'natives';

import { Color, Invoke, NativeMenu, Selection, TextInput } from '../../../shared/types/nativeMenu.js';
import { getInput } from './input.js';

let onDestroy: Function;

// Page Navigation
let pageLimit = 8;
let maxPageIndex: number;
let pageIndex = 0;

// Up & Down Navigation
let currentOptions: Array<Selection | Invoke | TextInput | Color> = [];
let optionIndex = 0;
let option: Selection | Invoke | TextInput | Color;

// Menu Information
let menu: NativeMenu;

function playSound(type: 'NAVIGATE' | 'ENTER' | 'BACK' | 'NAV_UP_DOWN' | 'OPEN') {
    switch (type) {
        case 'OPEN':
            native.playSoundFrontend(-1, 'CONTINUE', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
            break;
        case 'NAVIGATE':
            native.playSoundFrontend(-1, 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
            break;
        case 'NAV_UP_DOWN':
            native.playSoundFrontend(-1, 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
            break;
        case 'ENTER':
            native.playSoundFrontend(-1, 'OK', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
            break;
        case 'BACK':
            native.playSoundFrontend(-1, 'BACK', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
            break;
    }
}

function updatePages() {
    const hasNextPage = pageIndex < maxPageIndex - 1;
    const hasPrevPage = pageIndex >= 1;

    const min = pageIndex * pageLimit;
    const max = min + pageLimit;

    const newOptions = menu.options.slice(min, max);

    if (hasNextPage || hasPrevPage) {
        newOptions.unshift({
            text: 'Pages',
            type: 'invoke',
            value: undefined,
            isPageChanger: true,
            rightCallback: hasNextPage ? nextPage : undefined,
            leftCallback: hasPrevPage ? prevPage : undefined,
        });
    }

    optionIndex = 0;
    currentOptions = newOptions;
    option = newOptions[optionIndex];
}

function nextPage() {
    if (pageIndex + 1 > maxPageIndex) {
        return;
    }

    pageIndex += 1;
    updatePages();
    playSound('NAVIGATE');
}

function prevPage() {
    if (pageIndex - 1 < 0) {
        return;
    }

    pageIndex -= 1;
    updatePages();
    playSound('NAVIGATE');
}

export function down() {
    if (optionIndex + 1 >= currentOptions.length) {
        optionIndex = 0;
    } else {
        optionIndex += 1;
    }

    option = currentOptions[optionIndex];
    alt.emit('crc-native-menu-option-changed', option);
    playSound('NAVIGATE');
}

export function up() {
    if (optionIndex - 1 < 0) {
        optionIndex = currentOptions.length - 1;
    } else {
        optionIndex -= 1;
    }

    option = currentOptions[optionIndex];
    alt.emit('crc-native-menu-option-changed', option);
    playSound('NAVIGATE');
}

export async function select() {
    switch (option.type) {
        case 'color':
            alt.emit(option.eventName, option.options[option.index]);
            break;
        case 'selection':
            alt.emit(option.eventName, option.options[option.index]);
            break;
        case 'input':
            const result = await getInput(option.value);
            option.value = result;
            alt.emit(option.eventName, result);
            break;
        case 'invoke':
            if (option.rightCallback) {
                option.rightCallback();
                break;
            }

            if (option.leftCallback) {
                option.leftCallback();
                break;
            }

            alt.emit(option.eventName, option.value);
            break;
    }

    playSound('ENTER');
}

export function back() {
    if (menu.backEvent) {
        playSound('BACK');
        alt.emit(menu.backEvent);
        return;
    }

    if (menu.noExit) {
        return;
    }

    playSound('BACK');
    destroy();
}

export function left() {
    if (!menu.options[optionIndex]) {
        return;
    }

    if (option.type === 'invoke' && option.leftCallback) {
        option.leftCallback();
        return;
    }

    if (option.type !== 'selection' && option.type !== 'color') {
        return;
    }

    if (option.index - 1 < 0) {
        option.index = option.options.length - 1;
    } else {
        option.index -= 1;
    }

    if (option.eventName) {
        alt.emit(option.eventName, option.options[option.index].value);
    }

    playSound('NAV_UP_DOWN');
}

export function right() {
    if (!menu.options[optionIndex]) {
        return;
    }

    if (option.type === 'invoke' && option.rightCallback) {
        option.rightCallback();
        return;
    }

    if (option.type !== 'selection' && option.type !== 'color') {
        return;
    }

    if (option.index + 1 >= option.options.length) {
        option.index = 0;
    } else {
        option.index += 1;
    }

    if (option.eventName) {
        alt.emit(option.eventName, option.options[option.index].value);
    }

    playSound('NAV_UP_DOWN');
}

export function getCurrentOptions() {
    return currentOptions;
}

export function getOptionIndex() {
    return optionIndex;
}

export function getMenu(): NativeMenu {
    return menu;
}

export function getPageCount() {
    return maxPageIndex - 1;
}

export function getPageIndex() {
    return pageIndex;
}

export function setMenu(_menu: NativeMenu, _onDestroy: Function) {
    menu = _menu;
    onDestroy = _onDestroy;
    maxPageIndex = Math.ceil(menu.options.length / pageLimit);
    if (maxPageIndex < 0) {
        maxPageIndex = 0;
    }

    updatePages();

    alt.emit('crc-instructional-buttons', {
        set: [
            { text: 'Back / Exit', input: '~INPUT_FRONTEND_RRIGHT~' },
            { text: 'Enter', input: '~INPUT_FRONTEND_RDOWN~' },
            { text: 'Change', input: '~INPUTGROUP_CELLPHONE_NAVIGATE_LR~' },
            { text: 'Navigate', input: '~INPUTGROUP_CELLPHONE_NAVIGATE_UD~' },
        ],
    });
}

export function destroy() {
    playSound('BACK');
    alt.emit('crc-instructional-buttons', { clear: true });

    if (onDestroy) {
        onDestroy();
        onDestroy = undefined;
    }

    menu = undefined;
    optionIndex = 0;
    maxPageIndex = 0;
    pageIndex = 0;
    currentOptions = [];
}
