import faunadb from 'faunadb'
import stringHash from '@sindresorhus/string-hash'
import {toDatabaseId} from '$lib/id'

const q = faunadb.query
const client = new faunadb.Client({
  domain: process.env.FAUNADB_DOMAIN,
  port: process.env.FAUNADB_PORT,
  scheme: process.env.FAUNADB_SCHEME,
  secret: process.env.FAUNADB_SERVER_SECRET,
})

export async function POST({locals, params, request}) {
  const socialId = params.socialId
  const reference = toDatabaseId(socialId)
  const {push} = await request.json()

  await client.query(
    q.Update(q.Ref(q.Collection('social'), reference), {
      data: {
        invitees: {
          [locals.userId]: {
            pushSubscriptions: {
              [stringHash(push.endpoint)]: push,
            },
          },
        },
      },
    }),
  )

  return new Response()
}

export async function DELETE({locals, params, request}) {
  const socialId = params.socialId
  const reference = toDatabaseId(socialId)
  const {push} = await request.json()

  await client.query(
    q.Update(q.Ref(q.Collection('social'), reference), {
      data: {
        invitees: {
          [locals.userId]: {
            pushSubscriptions: {
              [stringHash(push.endpoint)]: null,
            },
          },
        },
      },
    }),
  )

  return new Response()
}
