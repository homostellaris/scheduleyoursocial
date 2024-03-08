<script>
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

<h1>The fastest way to find out when your friends are free</h1>
<p>Let's start with your name</p>

<!-- TODO: Add enhancement to get loading state again -->
<!-- use:enhance={() => {
  loading = true
  return async ({update}) => {
    loading = false
    update()
  }
}} -->
<!-- svelte-ignore missing-declaration -->
<form method="post">
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
