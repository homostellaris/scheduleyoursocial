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

import dotenv from 'dotenv'
dotenv.config()

import faunadb from 'faunadb'
const q = faunadb.query
const client = new faunadb.Client({
  domain: process.env.FAUNADB_DOMAIN,
  port: process.env.FAUNADB_PORT,
  scheme: process.env.FAUNADB_SCHEME,
  secret: process.env.FAUNADB_SERVER_SECRET,
})

import {toSocialId, toDatabaseId} from '../../src/lib/id.js'

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
export default (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    async createSocial(data) {
      const faunaData = {
        data: {
          ...faunaify(data),
        },
      }
      const social = await client.query(
        q.Create(q.Collection('social'), faunaData),
      )
      social.id = toSocialId(social.ref.id)
      return social
    },
    async updateSocial({id, data}) {
      const reference = toDatabaseId(id)
      const response = await client.query(
        q.Update(q.Ref(q.Collection('social'), reference), {
          data: {
            invitees: {
              fakeId: {
                name: 'Max',
                dates: [q.Date(data)],
              },
            },
          },
        }),
      )
      return response
    },
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

function faunaify(data) {
  return {
    invitees: Object.fromEntries(
      Object.entries(data.invitees).map(([id, invitee]) => [
        id,
        {
          name: invitee.name,
          dates: invitee.dates.map(date => q.Date(date)),
        },
      ]),
    ),
    organizer: data.organizer,
  }
}
