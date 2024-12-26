import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false, // Ensures all CSS is in a single file
    rollupOptions: {
      output: {
        entryFileNames: 'script.js',
        chunkFileNames: '[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    outDir: 'dist', // Output directory
    cssFileName: 'styles.css' // Ensures the CSS file is named styles.css
  }
});
