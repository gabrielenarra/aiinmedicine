// Configurazione delle prove automatiche (npm test).
const { defineConfig, devices } = require('@playwright/test');

const PORTA = 8081;

module.exports = defineConfig({
  testDir: 'tests',
  outputDir: 'tests/risultati',
  reporter: [['list']],
  use: {
    ...devices['Desktop Chrome'],
    browserName: 'chromium',
  },
  projects: [{ name: 'chromium' }],
  webServer: {
    command: 'node tests/server-prova.js',
    url: `http://127.0.0.1:${PORTA}/index.html`,
    env: { PORTA: String(PORTA) },
    reuseExistingServer: false,
  },
});
