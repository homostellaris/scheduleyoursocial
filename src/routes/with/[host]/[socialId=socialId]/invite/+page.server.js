import faunadb from 'faunadb'
import {toDatabaseId} from '$lib/id'
import convertDatesToStrings from '$lib/convertDatesToStrings'
import notification from '$lib/server/notification'
import {redirect} from '@sveltejs/kit'

const q = faunadb.query

const client = new faunadb.Client({
  domain: process.env.FAUNADB_DOMAIN,
  port: process.env.FAUNADB_PORT,
  scheme: process.env.FAUNADB_SCHEME,
  secret: process.env.FAUNADB_SERVER_SECRET,
})

export async function load({params, locals}) {
  const socialId = params.socialId
  const reference = toDatabaseId(socialId)
  const response = await client.query(
    q.Get(q.Ref(q.Collection('social'), reference)),
  )
  const social = convertDatesToStrings(response.data)
  if (social.decision) social.decision = social.decision.value
  const user = social.invitees[locals.userId]

  if (user) {
    const page = user.dates.length ? 'everyone' : 'you'
    redirect(303, page)
  }

  return {
    social,
    user,
  }
}

export const actions = {
  default: async ({locals, params, request}) => {
    const socialId = params.socialId
    const reference = toDatabaseId(socialId)

    const data = await request.formData()
    const name = data.get('name')

    const {data: social} = await client.query(
      q.Update(q.Ref(q.Collection('social'), reference), {
        data: {
          invitees: {
            [locals.userId]: {
              name,
            },
          },
        },
      }),
    )

    notification.send(social, locals.userId, {
      title: `${name} joined the social`,
      body: `That makes ${Object.keys(social.invitees).length} so far.`,
      socialUrl: `${request.headers.get('origin')}/${socialId}/everyone`,
    })

    redirect(303, `you?name=${name}`)
  },
}
