<script>
  import {page} from '$app/stores'
  import {Button} from 'spaper'
</script>

<footer>
  <span>
    <Button id="feedback" type="primary">Leave feedback</Button>
  </span>

  {#if $page.url.pathname.match(/[\d\w]{12}/)}
    <span
      ><a href="/" data-sveltekit-preload-data>Schedule another social</a></span
    >
  {/if}
  <span><a href="/privacy" data-sveltekit-preload-data>Privacy</a></span>
</footer>

<style>
  :global(#feedback) {
    margin: 0;
  }

  footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
  }

  footer a {
    font-weight: bold;
  }

  footer span {
    text-align: center;
  }
</style>
