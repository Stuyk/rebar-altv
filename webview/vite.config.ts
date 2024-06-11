import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    base: './',
    build: {
        outDir: '../resources/webview',
        emptyOutDir: true,
        minify: 'esbuild',
        reportCompressedSize: false,
    },
    resolve: {
        alias: {
            '@Client': path.resolve(__dirname, '../src/main/client'),
            '@Server': path.resolve(__dirname, '../src/main/server'),
            '@Shared': path.resolve(__dirname, '../src/main/shared'),
            '@Plugins': path.resolve(__dirname, '../src/plugins'),
            '@Composables': path.resolve(__dirname, './composables'),
            '@Components': path.resolve(__dirname, './components'),
        },
    },
    plugins: [vue()],
});
