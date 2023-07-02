import faunadb from 'faunadb'
import { toDatabaseId } from '$lib/id'
import notification from '$lib/server/notification'

const q = faunadb.query

const client = new faunadb.Client({
	domain: process.env.FAUNADB_DOMAIN,
	port: process.env.FAUNADB_PORT,
	scheme: process.env.FAUNADB_SCHEME,
	secret: process.env.FAUNADB_SERVER_SECRET,
})

export async function post ({ locals, params, request }) {
	const socialId = params.socialId
	const reference = toDatabaseId(socialId)

	const data = await request.formData()
	const name = data.get('name')


	const { data: social } = await client.query(
		q.Update(
			q.Ref(q.Collection('social'), reference),
			{
				data: {
					invitees: {
						[locals.userId]: {
							name
						}
					}
				}
			}
		)
	)

	notification.send(
		social,
		locals.userId,
		{
			title: `${name} joined the social`,
			body: `That makes ${Object.keys(social.invitees).length} so far.`,
			socialUrl: `${request.headers.get('origin')}/${socialId}/everyone`
		}
	)

	return {
		status: 200,
	}
}
