import slugify from '$lib/slugify'
import {error, redirect} from '@sveltejs/kit'

import faunadb from 'faunadb'

const q = faunadb.query

const client = new faunadb.Client({
  domain: process.env.FAUNADB_DOMAIN,
  port: process.env.FAUNADB_PORT,
  scheme: process.env.FAUNADB_SCHEME,
  secret: process.env.FAUNADB_HOST_MANAGER_SECRET,
})

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  const secret = event.url.searchParams.get('secret')
  if (secret !== process.env.FAUNADB_HOST_MANAGER_SECRET) {
    error(401)
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({request, url}) => {
    const secret = url.searchParams.get('secret')
    if (secret !== process.env.FAUNADB_HOST_MANAGER_SECRET) {
      error(401)
    }

    const formData = await request.formData()
    const hostSlug = slugify(formData.get('host'))
    const hostData = {slug: hostSlug, ...Object.fromEntries(formData.entries())}

    await client.query(
      q.Create(q.Collection('host'), {
        data: {...hostData},
      }),
    )

    const hostUrl = url.pathname + '/' + hostSlug
    redirect(303, hostUrl)
  },
}
