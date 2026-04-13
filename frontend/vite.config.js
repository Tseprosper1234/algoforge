import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB (optional)
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React vendor
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI libraries
          'vendor-ui': ['react-markdown', 'react-syntax-highlighter', 'react-icons'],
          // Syntax highlighter languages (if you use many languages, they can be split further)
          'vendor-syntax': ['react-syntax-highlighter/dist/esm/languages/prism'],
          // Supabase client
          'vendor-supabase': ['@supabase/supabase-js'],
          // Other large dependencies (if any)
          'vendor-other': ['axios', 'date-fns', 'react-hook-form']
        },
        // Ensure proper chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})