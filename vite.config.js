// // vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';
// import tagger from "@dhiwise/component-tagger";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(),tagger()],
//   build: {
//     outDir: "build",
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve('./src'),
//       '@components': path.resolve('./src/components'),
//       '@pages': path.resolve('./src/pages'),
//       '@assets': path.resolve('./src/assets'),
//       '@constants': path.resolve('./src/constants'),
//       '@styles': path.resolve('./src/styles'),
//     },
//   },
//   server: {
//     port: "4028",
//     host: "0.0.0.0",
//     strictPort: true,
//     allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
//   }
// });




import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tagger from '@dhiwise/component-tagger';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tagger()],
  root: '.', // Explicitly set root to project directory (where index.html should be)
  build: {
    outDir: 'dist', // Use default 'dist' for Vercel compatibility (changed from 'build')
    emptyOutDir: true, // Clear output directory before building
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Use __dirname for robust path resolution
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 4028, // No quotes needed for port number
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'], // Ensure this is needed for your setup
  },
});