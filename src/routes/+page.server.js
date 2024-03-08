import faunadb from 'faunadb'
import {toSocialId} from '$lib/id'
import {redirect} from '@sveltejs/kit'

const q = faunadb.query
const client = new faunadb.Client({
  domain: process.env.FAUNADB_DOMAIN,
  port: process.env.FAUNADB_PORT,
  scheme: process.env.FAUNADB_SCHEME,
  secret: process.env.FAUNADB_SERVER_SECRET,
})

export const actions = {
  default: async ({locals, request}) => {
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

    throw redirect(303, `/${socialId}/you`)
  },
}
