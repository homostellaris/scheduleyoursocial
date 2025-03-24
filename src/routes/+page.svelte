<script>
  import Logo from '$lib/Logo.svelte'
  import Page from '$lib/Page.svelte'
  import {goto} from '$app/navigation'
  import Next from '$lib/Next.svelte'
  import {theme} from '$lib/theme.store'
  import {Alert, Button, Progress} from 'spaper'
  import {getContext, onMount} from 'svelte'

  let loading
  // TODO: Find a better way to do this.
  $theme.background = 'beer'

  const {getAnalytics} = getContext('analytics')

  onMount(() => {
    document.getElementById('name').focus()
  })
</script>

<Page>
  <Alert
    dismissible
    type="warning"
    style="position: absolute; top: 0.5rem; width: fit-content; max-width: 95vw; gap: 0.5rem;"
  >
    <p style:margin={0} style:text-align="left" style="font-size: 0.8rem;">
      🚧 We need support to keep the site running beyond May 30th. <a
        style:font-family="'Port Lligat Slab', serif"
        href="/blog/database-migration-funding">Learn more</a
      >.
    </p>
    <Button
      type="success"
      size="small"
      on:click={() => {
        getAnalytics().trackEvent('Database migration donation button clicked')
        document.querySelector('#bmc-wbtn').onclick()
      }}>Donate</Button
    >
  </Alert>
  <Logo width={100} --margin="1rem" />
  <h1>Schedule Your Social</h1>
  <p>Let's start with your name</p>

  <!-- svelte-ignore missing-declaration -->
  <form
    on:submit={async e => {
      loading = true

      try {
        const formData = new FormData(e.target)
        const name = formData.get('name')

        const response = await fetch('/create', {
          method: 'POST',
          body: formData,
        })

        const socialId = await response.text()
        await goto(`${socialId}/you?name=${name}`)
      } finally {
        loading = false
      }
    }}
  >
    <input
      id="name"
      class="margin-bottom-small"
      name="name"
      style="text-transform: uppercase;"
    />
    <Next disabled={loading} />
    <div>
      <Progress
        style={`visibility: ${loading ? 'visible' : 'hidden'};`}
        infinite
        striped
      />
    </div>
  </form>
</Page>
