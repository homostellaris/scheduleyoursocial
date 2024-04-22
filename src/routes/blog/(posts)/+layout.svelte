<script>
  import Page from '$lib/Page.svelte'
  import Promo from '$lib/Promo.svelte'
</script>

<Page --background="white">
  <div class="content">
    <slot />
  </div>
  <Promo />
</Page>

<style>
  .content {
    max-width: 900px;
    /* font-size: 1rem; */
  }

  /* :global(.content *) {
    color: black;
  } */
  :global(.content h1),
  :global(.content h2),
  :global(.content h3) {
    font-family: 'Amatic SC', cursive;
    text-align: left;
  }

  :global(.content h1) {
    font-size: 2.59em;
    /* width: 50%; */
  }
  /* 
  :global(.content .hero) {
    
  } */

  :global(.content h2),
  :global(.content h3) {
    font-family: 'Amatic SC', cursive;
    margin: 1rem 0;
    max-width: 65ch;
  }

  :global(.content p) {
    font-family: 'Port Lligat Slab';
    margin: 1rem 0;
    max-width: 65ch;
    text-align: left;
    /* letter-spacing: 0.1rem; */
  }

  :global(.content a) {
    font-family: 'Port Lligat Slab', serif;
  }

  :global(.content li) {
    font-family: 'Port Lligat Slab', serif;
  }
</style>
