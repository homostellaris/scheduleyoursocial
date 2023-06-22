<script context="module">
  import Retreat from "$lib/Back.svelte"
</script>

<script>
  export let social
  let decision
  $: decision = new Date(social.decision).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
</script>

<h1>You're social is on {decision}</h1>
<p>
  Have fun 🎉 and if you found this app helpful then please share it with others or <a
    href="https://www.producthunt.com/products/schedule-your-social/reviews/new"
    >leave us a review</a
  > 🙏
</p>

<Retreat back="everyone" />
