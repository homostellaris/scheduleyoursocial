import { json } from '@sveltejs/kit';
import faunadb from 'faunadb'
import {toSocialId} from '$lib/id'

const q = faunadb.query

const client = new faunadb.Client({
  domain: process.env.FAUNADB_DOMAIN,
  port: process.env.FAUNADB_PORT,
  scheme: process.env.FAUNADB_SCHEME,
  secret: process.env.FAUNADB_SERVER_SECRET,
})

export async function POST({request, locals}) {
  const data = await request.formData()
  const name = data.get('name')

  const response = await client.query(
    q.Create(q.Collection('social'), {
      data: {
        invitees: {
          [locals.userId]: {
            name,
          },
        },
        organizer: locals.userId,
      },
    }),
  )
  const socialId = toSocialId(response.ref.id)

  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
  // Suggestion (check for correctness before using):
  // return json(socialId);
  return {
    body: socialId,
    status: 200,
  }
}
