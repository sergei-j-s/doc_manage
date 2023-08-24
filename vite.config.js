import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { presetUno } from 'unocss';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  server: {
    host: true,
    port: '8085',
    hot: true
  },
  plugins: [
    vue(),
    UnoCSS({
      presets: [
        presetUno({
          variablePrefix: 'lsr-'
        })
      ]
    }),
    Components({
      resolvers: [
        NaiveUiResolver()
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src',
        import.meta.url))
    }
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          console.log(assetInfo.name);
          let extType = assetInfo.name.match(/\.([^.]+)$|$/)[1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'image';
          };
          if (/woff|woff2|ttf|eot|tiff/i.test(extType)) {
            extType = 'fonts';
          };
          return `build/${extType}/[name].[hash][extname]`;
        },
        chunkFileNames: 'build/js/[name].[hash].js',
        entryFileNames: 'build/js/[name].[hash].js'
      }
    }
  }
})
