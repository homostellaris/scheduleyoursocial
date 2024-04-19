// TODO: Make everywhere use this fauna config
// TODO: Handle all redirects in one place here
/** @type {import('./$types').PageServerLoad} */
export function load(event) {
  return {
    userId: event.locals.userId,
    faunadb: {
      domain: process.env.FAUNADB_DOMAIN,
      port: process.env.FAUNADB_PORT,
      scheme: process.env.FAUNADB_SCHEME,
      secret: process.env.FAUNADB_INVITEE_SECRET,
    },
  }
}
