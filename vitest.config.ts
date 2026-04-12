import { defineConfig } from 'vitest/config'
import { webdriverio } from '@vitest/browser-webdriverio'
import react from '@vitejs/plugin-react'
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    browser: {
      enabled: true,
      headless: false,
      provider: webdriverio(),
      screenshotFailures: false,
      // https://vitest.dev/config/browser/webdriverio
      instances: [
        { browser: 'firefox' },
      ],
    },
    env: {
      BROWSER: process.env.BROWSER === 'true' ? 'true' : 'false',
      HEADLESS: process.env.HEADLESS === 'true' ? 'true' : 'false',
      MSW_QUIET: process.env.MSW_QUIET === 'true' ? 'true' : 'false',
    },
  },
})
