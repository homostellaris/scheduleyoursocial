<script context="module">
  import LandingPage from '$lib/LandingPage.svelte'

	export const prerender = true
</script>

<script>
	export let title
	export let description
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content="{description}">
</svelte:head>

<h1>The fastest way to find out when your friends are free</h1>
<p>Schedule Your Social is the social planning app that has no signup, no ads, and is completely free. We help you find a date that works for everyone in three easy steps.</p>
<ol>
	<li>Enter your name and availability 📅</li>
	<li>Share the link with your friends 🔗</li>
	<li>Choose the best date ✅</li>
</ol>

<a href="/">Get started!</a>
