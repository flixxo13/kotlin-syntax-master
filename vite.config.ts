import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    // 1. REIHENFOLGE: Tailwind MUSS vor React stehen
    plugins: [tailwindcss(), react()],
    
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    
    resolve: {
      alias: {
        // Stellt sicher, dass @ auf das Wurzelverzeichnis zeigt
        '@': path.resolve(__dirname, './'),
      },
    },

    // 2. WICHTIG FÜR REACT 19 / VITE 6:
    // Hilft Rollup/Vite die JSX-Runtime während des Builds zu finden
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime'],
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      port: 3000,
    },

    build: {
      // Hilft bei der Auflösung von CommonJS Modulen, falls vorhanden
      commonjsOptions: {
        include: [/node_modules/],
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'motion': ['motion'],
            'codemirror': [
              '@codemirror/state',
              '@codemirror/view',
              '@codemirror/commands',
              '@codemirror/language',
            ],
            'ui': ['lucide-react', 'zustand'],
          },
        },
      },
    },
  };
});
