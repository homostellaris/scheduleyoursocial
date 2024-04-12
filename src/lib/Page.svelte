<script>
  import Bubbles from '$lib/Bubbles/index.svelte'
  import Footer from '$lib/Footer.svelte'

  export let effect = 'bubbles'
</script>

<div class="main-container">
  {#if effect === 'bubbles'}
    <Bubbles />
  {/if}
  <main>
    <slot />
  </main>
  <Footer />
</div>

<style>
  .main-container {
    background: var(--background);
    display: flex;
    flex-direction: column;
    min-height: 100%;
    max-width: 100vw;
    position: relative;
  }

  main {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    margin: auto;
    padding: 1rem;
    position: relative;
  }
</style>
