<script>
  import {goto} from '$app/navigation'
  import Next from '$lib/Next.svelte'
  import {Progress} from 'spaper'
  import {onMount} from 'svelte'

  /** @type {import('./$types').PageData} */
  export let data
  let loading

  console.log({data})

  onMount(() => {
    document.getElementById('name').focus()
  })
</script>

<svelte:head>
  <title>Schedule your social with {data.host}</title>
</svelte:head>

<img src={data.image} alt="" />
<h1>Schedule your social</h1>
<h2>with {data.host}</h2>
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
      await goto(`/with/${data.host}/${socialId}/you?name=${name}`)
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
