<script>
  import Logo from '$lib/Logo.svelte'
  import Page from '$lib/Page.svelte'
  import {goto} from '$app/navigation'
  import Next from '$lib/Next.svelte'
  import {theme} from '$lib/theme.store'
  import {Progress} from 'spaper'
  import {onMount} from 'svelte'

  let loading
  // TODO: Find a better way to do this.
  $theme.background = 'beer'

  onMount(() => {
    document.getElementById('name').focus()
  })
</script>

<svelte:head>
  <title>The fastest way to find out when your friends are free</title>
</svelte:head>

<Page>
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
