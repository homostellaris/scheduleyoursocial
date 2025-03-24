<script>
  import {goto} from '$app/navigation'
  import {page} from '$app/stores'
  import Ads from '$lib/Ads.svelte'
  import Retreat from '$lib/Back.svelte'
  import BestDates from '$lib/BestDates.svelte'
  import convertDatesToStrings from '$lib/convertDatesToStrings'
  import {toDatabaseId} from '$lib/id'
  import Invitees from '$lib/Invitees.svelte'
  import Inviter from '$lib/Inviter.svelte'
  import Next from '$lib/Next.svelte'
  import push from '$lib/push'
  import StreamingStatus from '$lib/StreamingStatus.svelte'
  import cookie from 'cookie'
  import faunadb from 'faunadb'
  import {Form, Progress, Switch} from 'spaper'
  import {getContext, onMount} from 'svelte'

  const {getAnalytics} = getContext('analytics')

  export let data
  let invitees
  let inviteesCount
  let decision = data.social.decision || null
  let status = 'Not started'
  let loading

  $: invitees = data.social.invitees
  $: inviteesCount = Object.values(invitees).length
  $: inviteesWithDates = Object.values(invitees).filter(
    invitee => invitee.dates && invitee.dates.length,
  )

  let pushBrowserSupport
  let pushPermission
  let pushSubscription
  let pushSwitch = false
  $: pushSwitch = !!(
    pushBrowserSupport &&
    pushPermission === 'granted' &&
    pushSubscription
  )

  onMount(async () => {
    const q = faunadb.query
    const client = new faunadb.Client({...$page.data.faunadb})

    const databaseId = toDatabaseId($page.params.socialId)
    const docRef = q.Ref(q.Collection('social'), databaseId)

    let stream

    console.info('Streaming social', databaseId)
    const startStream = () => {
      stream = client.stream
        .document(docRef)
        .on('snapshot', snapshot => {
          console.debug('snapshot')
          data.social = convertDatesToStrings(snapshot.data)
        })
        .on('version', version => {
          console.debug('version')
          data.social = convertDatesToStrings(version.document.data)

          const newDecision =
            data.social.decision &&
            data.social.decision.value !==
              cookie.parse(document.cookie).decision
          if (newDecision) goto('decision')

          status = '📡 Updated: someone joined the party!'
        })
        .on('error', error => {
          console.error(error)
          stream.close()
          setTimeout(startStream, 1000)
        })
        .start()
    }

    startStream()
    status = '📡 Live-streaming updates'

    pushBrowserSupport =
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    if (!pushBrowserSupport) return

    pushPermission = Notification.permission
    pushSubscription = await push.getExistingSubscription()

    if (
      pushSubscription &&
      (!data.user.pushSubscriptions ||
        !Object.values(data.user.pushSubscriptions).find(
          savedPushSubscription =>
            pushSubscription.endpoint === savedPushSubscription,
        ))
    ) {
      await fetch('push', {
        method: 'POST',
        body: JSON.stringify({
          push: pushSubscription,
        }),
      })
    }
  })
</script>

<svelte:head>
  <title>Everyone</title>
</svelte:head>

<StreamingStatus {status} />

<Inviter />

<p style="margin-top: 1rem;">
  Enable push notifications and we'll update you when people join the social or
  a decision is made.
</p>
<Form
  title={!pushBrowserSupport
    ? 'Your browser does not support push notifications'
    : pushPermission === 'denied'
      ? "You've denied notification permissions. Update your browser settings for this website and click this button again if you'd like to enable them."
      : !pushSubscription
        ? 'Push permissions are granted but you need to enable them.'
        : 'Push notifications are enabled 📡'}
>
  <Switch
    name="push-notifications"
    inline
    checked={pushSwitch}
    disabled={!pushBrowserSupport}
    on:change={async event => {
      const switchOn = event.detail

      if (!switchOn) {
        getAnalytics().trackEvent('Disable push notifications')
        await push.unsubscribe()
        await fetch('push', {
          method: 'DELETE',
          body: JSON.stringify({
            push: pushSubscription,
          }),
        })
        pushSubscription = null
        return
      }

      getAnalytics().trackEvent('Enable push notifications')
      pushPermission = await push.askPermission()
      const permissionGranted = pushPermission === 'granted'
      if (permissionGranted) {
        pushSubscription = await push.subscribe()
        await fetch('push', {
          method: 'POST',
          body: JSON.stringify({
            push: pushSubscription,
          }),
        })
      }
    }}
    ><span
      class:disabled={!pushBrowserSupport}
      style:font-family="'Port Lligat Slab', serif"
    >
      PUSH NOTIFICATIONS
    </span>
  </Switch>
</Form>

{#if inviteesCount === 1}
  <!-- <h1>Whilst you're waiting...</h1> -->
  <h1>Waiting for others to join...</h1>
  <Invitees {invitees} />
{:else if inviteesCount === 2}
  <h1>Just the two of you ❤️</h1>
  <Invitees {invitees} />
{:else if inviteesCount > 2}
  <h1>{inviteesCount} people! Now we're talking 🥳</h1>
  <Invitees {invitees} />
{/if}

{#if inviteesWithDates.length > 1}
  <h1>Choose a date</h1>
  <!-- svelte-ignore missing-declaration -->
  <form id="everyone" method="post">
    <BestDates {invitees} bind:selected={decision} />
  </form>
{:else}
  <!-- <Ads /> -->
{/if}

<div style="margin: 1rem;">
  <Retreat back="you" />
  <Next disabled={inviteesWithDates.length < 2 || !decision} form="everyone" />
  <div style="margin: 1rem;">
    <Progress
      style={`visibility: ${loading ? 'visible' : 'hidden'};`}
      infinite
      striped
    />
  </div>
</div>

<style>
  h1 {
    align-self: center;
    font-size: 1.61em;
    margin: 2rem 0 0rem 0;
  }
</style>
