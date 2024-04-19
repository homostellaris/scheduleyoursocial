import faunadb from 'faunadb'
import {toDatabaseId} from '$lib/id'
import convertDatesToStrings from '$lib/convertDatesToStrings'
import {hasDecisionBeenSeen} from '$lib/redirectToDecision'
import {redirect} from '@sveltejs/kit'

const q = faunadb.query

const client = new faunadb.Client({
  domain: process.env.FAUNADB_DOMAIN,
  port: process.env.FAUNADB_PORT,
  scheme: process.env.FAUNADB_SCHEME,
  secret: process.env.FAUNADB_SERVER_SECRET,
})

/** @type {import('./$types').PageServerLoad} */
export async function load({params, locals, request}) {
  const socialId = params.socialId
  const reference = toDatabaseId(socialId)
  const response = await client.query(
    q.Get(q.Ref(q.Collection('social'), reference)),
  )
  const social = convertDatesToStrings(response.data)
  if (social.decision) social.decision = social.decision.value
  const user = social.invitees[locals.userId]

  if (hasDecisionBeenSeen(request, social)) {
    redirect(303, `${socialId}/decision`)
  }

  return {
    social,
    user,
  }
}
