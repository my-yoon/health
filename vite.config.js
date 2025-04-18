import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export default defineConfig(({ mode }) => {
    const _buildOptions = (mode === 'prod') ? {
        sourcemap: true,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    } : {};

    return {
        base: '/health/',
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        compatConfig: {
                            MODE: 3
                        }
                    },
                    script: {
                        defineModel: true
                    }
                }
            }),
            ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            port: 8080,
            host: true,
            proxy: {
                '/api': {
                    target: 'https://dev-api-adm.kb-ocare.co.kr',
                    changeOrigin: true,
                    secure: false,
                    rewrite: path => path.replace(/^\/api/, '')
                }
            }
        },
        build: {
            ..._buildOptions,
            assetsDir: 'assets',
            rollupOptions: {
                output: {
                    manualChunks: undefined
                }
            }
        },
        esbuild: {
            logOverride: { 'this-is-undefined-in-esm': 'silent' }
        }
    };
});

