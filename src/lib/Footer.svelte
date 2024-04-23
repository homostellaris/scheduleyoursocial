<script>
  import {page} from '$app/stores'
  import {Button} from 'spaper'
</script>

<footer>
  <!-- <span>
    <Button id="feedback" outline="primary" --main-background="transparent"
      >Leave feedback</Button
    >
  </span> -->

  <span
    ><a href="/" data-sveltekit-preload-data>Schedule another social</a></span
  >
  <span><a href="/privacy" data-sveltekit-preload-data>Privacy</a></span>
  {#if $page.url.pathname !== '/blog'}
    <span><a href="/blog" data-sveltekit-preload-data>Blog</a></span>
  {/if}
</footer>

<style>
  :global(#feedback) {
    margin: 0;
  }

  footer {
    display: flex;
    justify-content: space-between;
    max-width: calc(100vw - 18px - 64px - 18px);
    margin: 0;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
    position: relative;
  }

  @media (min-width: 420px) {
    footer {
      justify-content: center;
      margin: 0 auto;
    }
  }

  footer a {
    font-weight: bold;
  }

  footer span {
    text-align: center;
  }
</style>
