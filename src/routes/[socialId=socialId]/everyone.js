import faunadb from 'faunadb'
import {toDatabaseId} from '$lib/id'
import notification from '$lib/server/notification'
import convertDatesToStrings from '$lib/convertDatesToStrings'
import {decisionRedirect, hasDecisionBeenSeen} from '$lib/redirectToDecision'

const q = faunadb.query

const client = new faunadb.Client({
  domain: process.env.FAUNADB_DOMAIN,
  port: process.env.FAUNADB_PORT,
  scheme: process.env.FAUNADB_SCHEME,
  secret: process.env.FAUNADB_SERVER_SECRET,
})

export async function GET({params, locals, request}) {
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

export async function PATCH({locals, params, request}) {
  const socialId = params.socialId
  const reference = toDatabaseId(socialId)
  // TODO: Use FormData instead.
  const {decision} = await request.json()

  const {data: social} = await client.query(
    q.Update(q.Ref(q.Collection('social'), reference), {
      data: {
        decision: q.Date(decision),
      },
    }),
  )

  const notAttendingInvitees = Object.values(social.invitees).filter(
    invitee => !invitee.dates.map(date => date.value).includes(decision),
  )
  const notAttendingNames = notAttendingInvitees.map(invitee => invitee.name)
  const body =
    notAttendingInvitees.length === 0
      ? `All ${
          Object.values(social.invitees).length
        } people are able to attend.`
      : `${
          Object.values(social.invitees).length - notAttendingNames.length
        } out of ${
          Object.values(social.invitees).length
        } can attend; ${notAttendingNames.join(', ')} can't make it.`

  notification.send(social, locals.userId, {
    title: `You're social is on ${new Date(decision).toLocaleDateString()}.`,
    body,
    socialUrl: `${request.headers.get('origin')}/${socialId}/decision`,
  })

  return {
    status: 200,
  }
}
