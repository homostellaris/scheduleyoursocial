import {toSocialId, toDatabaseId} from '../../src/lib/id.js'

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

export async function create(data) {
  const faunaData = {
    data: {
      ...faunaify(data),
    },
  }
  const social = await client.query(q.Create(q.Collection('social'), faunaData))
  social.id = toSocialId(social.ref.id)
  return social
}

export async function update({id, data}) {
  const reference = toDatabaseId(id)
  const faunaData = {
    data: {
      ...faunaify(data),
    },
  }

  const response = await client.query(
    q.Update(q.Ref(q.Collection('social'), reference), faunaData),
  )
  return response
}

function faunaify(data) {
  let faunaData = {}
  if (data.invitees) {
    faunaData.invitees = Object.fromEntries(
      Object.entries(data.invitees).map(([id, invitee]) => [
        id,
        {
          name: invitee.name,
          dates: invitee.dates.map(date => q.Date(date)),
        },
      ]),
    )
  }
  if (data.organizer) {
    faunaData.organizer = data.organizer
  }
  if (data.decision) {
    faunaData.decision = q.Date(data.decision)
  }
  return faunaData
}
