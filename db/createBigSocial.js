import {faker} from '@faker-js/faker'
import faunadb from 'faunadb'
import {toSocialId} from '../src/lib/id.js'

const q = faunadb.query

const client = new faunadb.Client({
  domain: process.env.FAUNADB_DOMAIN,
  port: process.env.FAUNADB_PORT,
  scheme: process.env.FAUNADB_SCHEME,
  secret: process.env.FAUNADB_SERVER_SECRET,
})

let invitees = {}
for (let i = 0; i < 30; i++) {
  invitees[faker.string.uuid()] = {
    name: faker.person.firstName(),
    dates: [
      q.Date(faker.date.future().toISOString().split('T')[0]),
      q.Date(faker.date.future().toISOString().split('T')[0]),
      q.Date(faker.date.future().toISOString().split('T')[0]),
    ],
  }
}

const response = await client.query(
  q.Create(q.Collection('social'), {
    data: {
      invitees,
    },
  }),
)
const socialId = toSocialId(response.ref.id)
console.info(`http://localhost:6602/${socialId}/everyone`)
