// TODO: Find out why this file has to have .cjs and remove the pluginFiles configuration.

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import {create, update} from './social.js'

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
export default (on, _config) => {
  on('task', {
    createSocial: create,
    updateSocial: update,
  })
}

const defaultSocial = {
  invitees: {
    organiserID: {
      dates: ['2025-01-01', '2025-01-02', '2025-01-03'],
      name: 'Olaf',
    },
    inviteeID: {
      dates: ['2025-01-01', '2025-01-02'],
      name: 'Ingrid',
    },
  },
  organizer: 'organiserID',
}
