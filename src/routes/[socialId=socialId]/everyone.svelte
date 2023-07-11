<script>
  import {goto} from "$app/navigation"
  import {page, session} from "$app/stores"
  // import Datepicker from '$lib/Datepicker.svelte'
  import convertDatesToStrings from "$lib/convertDatesToStrings"
  import BestDates from "$lib/BestDates.svelte"
  import {toDatabaseId} from "$lib/id"
  import Next from "$lib/Next.svelte"
  import Retreat from "$lib/Back.svelte"
  import Invitees from "$lib/Invitees.svelte"
  import faunadb from "faunadb"
  import {onMount} from "svelte"
  import StreamingStatus from "$lib/StreamingStatus.svelte"
  import Inviter from "$lib/Inviter.svelte"
  import push from "$lib/push"

  export let social
  export let user

  let invitees
  let inviteesCount
  // let dates
  let decision = social.decision || null
  let status = "Not started"

  $: invitees = social.invitees
  $: inviteesCount = Object.values(invitees).length
  $: inviteesWithDates = Object.values(invitees).filter(
    invitee => invitee.dates && invitee.dates.length
  )
  // $: dates = Object.entries(invitees)
  // 	.filter(([inviteeId, _]) => selected ? inviteeId === selected : true)
  // 	.map(([_, invitee]) => invitee.dates)
  // 	.reduce((allDates, inviteeDates) => allDates.concat(inviteeDates), [])
  // 	.map(date => new Date(date).getTime())

  let pushEnabled
  let pushPermission
  let pushSubscription

  onMount(async () => {
    const q = faunadb.query
    const client = new faunadb.Client({...$session.faunadb})

    const databaseId = toDatabaseId($page.params.socialId)
    const docRef = q.Ref(q.Collection("social"), databaseId)

    let stream

    console.info("Streaming social", databaseId)
    const startStream = () => {
      stream = client.stream
        .document(docRef)
        .on("snapshot", snapshot => {
          social = convertDatesToStrings(snapshot.data)
        })
        .on("version", version => {
          social = convertDatesToStrings(version.document.data)

          const newDecision =
            social.decision && social.decision.value !== sessionStorage.getItem("decisionSeen")
          if (newDecision) goto("decision")

          status = "📡 Updated: someone joined the party!"
        })
        .on("error", error => {
          console.error(error)
          stream.close()
          setTimeout(startStream, 1000)
        })
        .start()
    }

    startStream()
    status = "📡 Live-streaming updates"

    pushEnabled = "serviceWorker" in navigator && "PushManager" in window
    pushPermission = Notification.permission
    pushSubscription = await push.getExistingSubscription()
    if (
      pushSubscription &&
      (!user.pushSubscriptions ||
        !Object.values(user.pushSubscriptions).find(
          savedPushSubscription => pushSubscription.endpoint === savedPushSubscription
        ))
    ) {
      await fetch("push.json", {
        method: "POST",
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

<h2>
  {inviteesCount > 1 ? "Here are the others!" : "You are the only one here..."}
</h2>
<Invitees {invitees} />
<Inviter />
<button
  disabled={!pushEnabled || pushPermission === "denied"}
  on:click={async () => {
    if (pushSubscription) {
      await push.unsubscribe()
      await fetch("push.json", {
        method: "DELETE",
        body: JSON.stringify({
          push: pushSubscription,
        }),
      })
      pushSubscription = null
      return
    }

    pushPermission = await push.askPermission()
    const permissionGranted = pushPermission === "granted"
    if (permissionGranted) {
      pushSubscription = await push.subscribe()
      await fetch("push.json", {
        method: "POST",
        body: JSON.stringify({
          push: pushSubscription,
        }),
      })
    }
  }}
  style="background-color: cornflowerblue;"
  title={!pushEnabled
    ? "Your browser does not support push notifications"
    : pushPermission === "denied"
    ? "You've denied notification permissions. Update your browser settings for this website and click this button again if you'd like to enable them."
    : !pushSubscription
    ? "Push permissions are granted but you need to enable them."
    : "Push notifications are enabled 📡"}
  >{pushPermission === "granted" && pushSubscription
    ? "DISABLE PUSH NOTIFICATIONS"
    : "ENABLE PUSH NOTIFICATIONS"}</button
>

<!-- <h2>Here's everyone's availability</h2>
<Datepicker disabledTo={10000} selected={dates}/> -->

{#if inviteesWithDates.length > 1}
  <h2>Choose a date</h2>
  <!-- svelte-ignore missing-declaration -->
  <form
    id="everyone"
    on:submit|preventDefault={async e => {
      const formData = new FormData(e.target)
      const decision = formData.get("best-dates")

      await fetch("everyone", {
        method: "PATCH",
        body: JSON.stringify({
          decision,
        }),
      })
      goto("decision")
    }}
  >
    <BestDates {invitees} bind:selected={decision} />
  </form>
{:else}
  <h2>Next steps</h2>
  <ol>
    <li>Wait for others to join 👆</li>
    <li>See which dates everyone is available 📅</li>
    <li>Choose a date and you're done! ✅</li>
  </ol>
{/if}

<div>
  <Retreat back="you" />
  <Next disabled={inviteesWithDates.length < 2 || !decision} form="everyone" />
</div>

<style>
  h2 {
    align-self: center;
  }
</style>
