import faunadb from 'faunadb'

const q = faunadb.query

const client = new faunadb.Client({
  domain: process.env.FAUNADB_DOMAIN,
  port: process.env.FAUNADB_PORT,
  scheme: process.env.FAUNADB_SCHEME,
  secret: process.env.FAUNADB_SERVER_SECRET,
})

/** @type {import('./$types').LayoutServerLoad} */
export async function load({params}) {
  const response = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index('host_by_slug'), params.host)),
      q.Lambda('host', q.Get(q.Var('host'))),
    ),
  )
  if (response.data.length > 1) {
    throw new Error('Multiple hosts found for slug ' + params.host)
  }

  return response.data[0].data
}
