<script>
  import Ads from '$lib/Ads.svelte'
  import ShareButton from '$lib/ShareButton.svelte'
  import Retreat from '$lib/Back.svelte'
  import cookie from 'cookie'
  import {Alert, Button} from 'spaper'
  import {getContext, onMount} from 'svelte'

  const {getAnalytics} = getContext('analytics')

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
<h1>Your social is on {friendlyDecision}</h1>
<p>Have fun 🎉</p>
<div style:display="flex" style:gap="0.5rem">
  <Retreat back="everyone" />
  <Button
    on:click={() => {
      getAnalytics().trackEvent('Buy me a beer')
    }}
    href="https://buymeacoffee.com/homostellaris"
    isLink
    external>Buy the creator a beer 🍻*</Button
  >
  <ShareButton
    on:click={() => {
      getAnalytics().trackEvent('Spread the word')
    }}
    url="https://scheduleyour.social?ref=decision-share"
    shareText="The fastest way to find out when your friends are free"
    >Spread the word</ShareButton
  >
</div>
<!-- <p style:font-size="0.8rem">*Beer helps support development</p> -->
<!-- <Ads /> -->
<!-- <iframe
  src="https://github.com/sponsors/homostellaris/button"
  title="Sponsor homostellaris"
  height="32"
  width="114"
  style="border: 0; border-radius: 6px;"
></iframe> -->
