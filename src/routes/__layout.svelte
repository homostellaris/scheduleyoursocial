<script context="module">
  import {dev} from '$app/env'
  import '../app.css'
  import Footer from '$lib/Footer.svelte'
  import {onMount, setContext} from 'svelte'
  import Plausible from 'plausible-tracker'
  import * as Sentry from '@sentry/browser'
  import {BrowserTracing} from '@sentry/tracing'
  import Bubbles from '$lib/Bubbles/index.svelte'

	export const prerender = true
</script>

<script>
  let plausible
  setContext('analytics', {
    getAnalytics: () => plausible
  })

  onMount(() => {
    Sentry.init({
      dsn: "https://5b7a4ba6b3ff446ea520d3b5d7b854f2@o1232542.ingest.sentry.io/6380542",
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      enabled: !dev,
    })

    // TODO: Raise a PR to define exports properly so this works with Vite.
    plausible = Plausible()
    plausible.enableAutoPageviews()
    plausible.enableAutoOutboundTracking()
  });
</script>

<Bubbles/>
<div class="container">
  <main>
    <slot />
  </main>
  <Footer />
</div>

<style>
  :root {
    --beer: #e87c00;
    --white: #fff;
  }

  :global(body) {
    position: relative;
  }

  .container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 1rem;
  }

  main {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    margin: auto;
    max-width: 900px;
  }
</style>
