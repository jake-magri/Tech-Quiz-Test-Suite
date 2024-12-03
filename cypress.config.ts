import { defineConfig } from 'cypress';
import viteConfig from './vite.config';

export default defineConfig({
  component: {
    port: 3000, // changed from 3001 to 3000
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig,
    },
    specPattern: "cypress/component/**/*.cy.{js,ts,jsx,tsx}",
  },

  e2e: {
    baseUrl: 'http://127.0.0.1:3000/', // changed from http://localhost:3001 to http://127.0.0.1:3000/ for server
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.cy.{js,ts,jsx,tsx}",
  },
});
