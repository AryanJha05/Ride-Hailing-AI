import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor_react: ['react', 'react-dom', 'react-router-dom'],
          vendor_mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          vendor_charts: ['recharts'],
          vendor_leaflet: ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
});
