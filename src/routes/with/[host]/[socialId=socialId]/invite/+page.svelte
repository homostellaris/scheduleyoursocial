<script>
  import Next from '$lib/Next.svelte'
  import {Progress} from 'spaper'
  import {onMount} from 'svelte'

  let loading

  onMount(() => {
    document.getElementById('name').focus()
  })
</script>

<svelte:head>
  <title>Invite</title>
</svelte:head>

<h1>You've been invited to a social</h1>
<p>Let's start with your name</p>
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
