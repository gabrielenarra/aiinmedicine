// Configurazione delle prove automatiche (npm test).
const { defineConfig, devices } = require('@playwright/test');

const PORTA = 8081;

module.exports = defineConfig({
  testDir: 'tests',
  outputDir: 'tests/risultati',
  reporter: [['list']],
  // 60 s per prova: il Chromium di prova disegna il 3D della sezione 07 senza scheda
  // grafica, e con molte prove in parallelo i pannelli aperti rallentano tutto
  timeout: 60000,
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
