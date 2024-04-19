<script lang="ts" setup>
import '../translate/index';
import { useTranslate } from '../../../main/shared/translate';

const { t } = useTranslate('en');

console.log(`Hello from webview`);
</script>

<template>
    <div>
        <div class="text-red-500 text-lg">{{ t('test.translate-from-webview') }}</div>
    </div>
</template>
