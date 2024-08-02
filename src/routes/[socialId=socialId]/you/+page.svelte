<script>
  import {Progress} from 'spaper'
  import Datepicker from '$lib/Datepicker.svelte'
  import {goto} from '$app/navigation'
  import Next from '$lib/Next.svelte'
  import {page} from '$app/stores'

  export let data

  let organizer = data.social.invitees[data.social.organizer]
  let name = $page.url.searchParams.get('name') || data.user.name
  let loading

  // Datepicker doesn't update bound array properly so unfortunately need to start with a fresh array everytime they return here.
  // let dates = user.dates || []
  let dates = []
</script>

<svelte:head>
  <title>You</title>
</svelte:head>

<!-- TODO: Should I use stores or session here instead of the query param? -->
<!-- Should use load function to support rendering existing selection here. -->
<!-- Need to add ability to edit name here too because pre-rendered page won't show data if for some reason the user comes back here. -->
<h1>Hello {name}, when are you free?</h1>
<!-- svelte-ignore missing-declaration -->
<form
  id="you"
  on:submit={async _ => {
    loading = true
    try {
      await fetch('you', {
        method: 'PUT',
        body: JSON.stringify({
          dates,
        }),
      })
      goto('everyone')
    } finally {
      loading = false
    }
  }}
>
  <div style:margin="0 auto" style:width="fit-content">
    <Datepicker bind:selected={dates} marked={organizer.dates} />
  </div>
  {#if organizer.dates.length}
    <p style="margin: 1rem;">👑 = days the organizer has chosen</p>
  {/if}
  <div style="text-align: center; margin: 1rem;">
    <Next />
  </div>
  <div style="margin: 1rem;">
    <Progress
      style={`visibility: ${loading ? 'visible' : 'hidden'};`}
      infinite
      striped
    />
  </div>
</form>

<style>
  h1 {
    margin: 1rem;
  }
</style>
