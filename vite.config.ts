import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function entryResolverPlugin(): Plugin {
  return {
    name: 'entry-resolver-fallback',
    resolveId(source) {
      if (
        source === './src/main.tsx' ||
        source === '/src/main.tsx' ||
        source === 'src/main.tsx' ||
        source.endsWith('/src/main.tsx')
      ) {
        const root = process.cwd();
        const candidates = [
          path.resolve(root, 'src/main.tsx'),
          path.resolve(root, 'src/Main.tsx'),
          path.resolve(root, 'src/index.tsx'),
          path.resolve(root, 'src/main.jsx'),
          path.resolve(root, 'src/main.ts'),
        ];
        for (const candidate of candidates) {
          if (fs.existsSync(candidate)) {
            return candidate;
          }
        }
        return path.resolve(root, 'src/main.tsx');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [entryResolverPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
