<script>
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
<p>
  Have fun 🎉 and if you found this app helpful then please share it with others
  or <a
    href="https://www.producthunt.com/products/schedule-your-social/reviews/new"
    >leave us a review</a
  > 🙏
</p>

<Retreat back="everyone" />
