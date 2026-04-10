import { defineConfig } from 'vitest/config'
import { webdriverio } from '@vitest/browser-webdriverio'
import react from '@vitejs/plugin-react'
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    setupFiles: ['./src/test/setup.ts'],
    browser: {
      enabled: true,
      provider: webdriverio(),
      screenshotFailures: false,
      // https://vitest.dev/config/browser/webdriverio
      instances: [
        { browser: 'firefox' },
      ],
    },
  },
})
