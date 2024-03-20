import {redirect} from '@sveltejs/kit'
import faunadb from 'faunadb'
import {toDatabaseId} from '$lib/id'

const q = faunadb.query
const client = new faunadb.Client({
  domain: process.env.FAUNADB_DOMAIN,
  port: process.env.FAUNADB_PORT,
  scheme: process.env.FAUNADB_SCHEME,
  secret: process.env.FAUNADB_SERVER_SECRET,
})

/** @type {import('./$types').RequestHandler} */
export async function PUT({locals, params, request}) {
  const socialId = params.socialId
  const reference = toDatabaseId(socialId)

  const {dates} = await request.json()

  await client.query(
    q.Update(q.Ref(q.Collection('social'), reference), {
      data: {
        invitees: {
          [locals.userId]: {
            dates: dates.map(date => q.Date(date)),
          },
        },
      },
    }),
  )

  redirect(303, `/${socialId}/everyone`);
}
