import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    base: './',
    build: {
        outDir: '../resources/webview',
        emptyOutDir: true,
        minify: 'esbuild',
        reportCompressedSize: false,
    },
    plugins: [vue()],
});
