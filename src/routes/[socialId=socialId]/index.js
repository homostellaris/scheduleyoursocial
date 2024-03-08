import faunadb from 'faunadb'
import {toDatabaseId} from '$lib/id'
import convertDatesToStrings from '$lib/convertDatesToStrings'
import {decisionRedirect, hasDecisionBeenSeen} from '$lib/redirectToDecision'

const q = faunadb.query

const client = new faunadb.Client({
  domain: process.env.FAUNADB_DOMAIN,
  port: process.env.FAUNADB_PORT,
  scheme: process.env.FAUNADB_SCHEME,
  secret: process.env.FAUNADB_SERVER_SECRET,
})

export async function get({params, locals, request}) {
  const socialId = params.socialId
  const reference = toDatabaseId(socialId)
  const response = await client.query(
    q.Get(q.Ref(q.Collection('social'), reference)),
  )
  const social = convertDatesToStrings(response.data)
  if (social.decision) social.decision = social.decision.value
  const user = social.invitees[locals.userId]

  if (hasDecisionBeenSeen(request, social)) return decisionRedirect(socialId)

  return {
    status: 200,
    body: {
      social,
      user,
    },
  }
}
