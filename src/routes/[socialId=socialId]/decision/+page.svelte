<script>
  import {Button} from 'spaper'
  import cookie from 'cookie'
  import Retreat from '$lib/Back.svelte'
  import {onMount} from 'svelte'

  export let data

  let friendlyDecision
  $: friendlyDecision = new Date(data.social.decision).toLocaleDateString(
    undefined,
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    },
  )

  onMount(() => {
    document.cookie = cookie.serialize('decision', data.social.decision)
  })
</script>

<svelte:head>
  <script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1845547317012102"
    crossorigin="anonymous"
  ></script>
</svelte:head>

<h1>Your social is on {friendlyDecision}</h1>
<p>Have fun 🎉</p>
<div style:display="flex" style:gap="0.5rem">
  <Retreat back="everyone" />
  <Button href="https://github.com/sponsors/homostellaris" isLink external
    >Buy me a beer 🍻*</Button
  >
</div>
<p style:font-size="0.8rem">*Beer helps support development</p>
<!-- <iframe
  src="https://github.com/sponsors/homostellaris/button"
  title="Sponsor homostellaris"
  height="32"
  width="114"
  style="border: 0; border-radius: 6px;"
></iframe> -->
