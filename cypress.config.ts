import { defineConfig } from 'cypress';
import viteConfig from './vite.config';

export default defineConfig({
  component: {
    //port: 5173, // updated to match
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig,
    },
    specPattern: "cypress/component/**/*.cy.{js,ts,jsx,tsx}",
  },

  e2e: {
    baseUrl: 'http://localhost:3000', // changed from 3001 to 3000 for full stack application
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
