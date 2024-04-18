<script>
  import Page from '$lib/Page.svelte'

  export let data
</script>

<Page --background={data.backgroundColor} effect={data.backgroundEffect}>
  <slot />
</Page>
