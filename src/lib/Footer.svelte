<script>
  import {page} from '$app/stores'
  import {Button} from 'spaper'
</script>

<footer>
  <div>
    <Button id="feedback" type="primary">Leave feedback</Button>
  </div>

  {#if $page.url.pathname !== '/'}
    <span
      ><a href="/" data-sveltekit-preload-data>Schedule another social</a></span
    >
  {/if}
  <span><a href="/privacy" data-sveltekit-preload-data>Privacy</a></span>
</footer>

<style>
  footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  footer a {
    font-weight: bold;
  }

  div,
  span {
    margin: 0.5rem;
    width: min-content;
  }

  @media (min-width: 480px) {
    /* Why dis? */
    footer {
      padding: 40px 0;
    }
    div,
    span {
      width: max-content;
    }
  }
</style>
