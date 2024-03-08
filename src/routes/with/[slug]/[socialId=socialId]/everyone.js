import faunadb from 'faunadb'
import {toDatabaseId} from '$lib/id'
import convertDatesToStrings from '$lib/convertDatesToStrings'

const q = faunadb.query

const client = new faunadb.Client({
  domain: process.env.FAUNADB_DOMAIN,
  port: process.env.FAUNADB_PORT,
  scheme: process.env.FAUNADB_SCHEME,
  secret: process.env.FAUNADB_SERVER_SECRET,
})

export async function GET({params, locals}) {
  const socialId = params.socialId
  const reference = toDatabaseId(socialId)
  const response = await client.query(
    q.Get(q.Ref(q.Collection('social'), reference)),
  )
  const social = convertDatesToStrings(response.data)
  if (social.decision) social.decision = social.decision.value
  const user = social.invitees[locals.userId]

  return {
    status: 200,
    body: {
      social,
      user,
    },
  }
}

export async function PATCH({params, request}) {
  const socialId = params.socialId
  const reference = toDatabaseId(socialId)
  // TODO: Use FormData instead.
  const {decision} = await request.json()

  await client.query(
    q.Update(q.Ref(q.Collection('social'), reference), {
      data: {
        decision: q.Date(decision),
      },
    }),
  )

  return {
    status: 200,
  }
}
