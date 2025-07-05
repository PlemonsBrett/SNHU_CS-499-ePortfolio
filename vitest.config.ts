import { defineConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';

export default defineConfig(
  getViteConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/cypress/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/e2e/**',
        '**/*.spec.ts'
      ],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'json'],
        exclude: [
          'node_modules/',
          'dist/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.*',
          'src/pages/api/',
          'public/'
        ],
        thresholds: {
          global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
          }
        }
      },
      typecheck: {
        enabled: true,
        tsconfig: './tsconfig.json'
      }
    }
  })
);