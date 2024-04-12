/** @type {import('./$types').LayoutLoad} */
export function load({params}) {
  // TODO: Call the DB here
  return {
    host: params.host,
    theme: {
      background: {
        color: 'purple',
        effect: 'bubbles',
      },
    },
  }
}
