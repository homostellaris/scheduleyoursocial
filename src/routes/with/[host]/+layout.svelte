<script>
  import Page from '$lib/Page.svelte'

  export let data
</script>

<Page
  --background={data.theme.background.color}
  effect={data.theme.background.effect}
>
  <slot />
</Page>
