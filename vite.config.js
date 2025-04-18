import { fileURLToPath, URL } from 'node:url';
import { createRequire } from 'node:module';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';
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
        base: '/health/',  // GitHub Pages base URL
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
            proxy: {
                '/api': {
                    target: 'https://dev-api-adm.kb-ocare.co.kr',
                    changeOrigin: true,
                    secure: false,
                    rewrite: path => path.replace(/^\/api/, '')
                }
            }
        },
        build: _buildOptions
    };
});

