<script>
  import {Select, Input, Button} from 'spaper'
  import Next from '$lib/Next.svelte'
  import Page from '$lib/Page.svelte'
  import slugify from '$lib/slugify'

  let host = 'Dave'
  // let textColor = '#41403e'
  let backgroundColor = '#e87c00'
  let backgroundEffect = 'bubbles'
  let image =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdnB_IPWHaVfjM2rCBCNMbN5Op6fxkXQgk8NHHlog6xg&s'
  let link = 'https://example.com'
  let hostUrl
  $: hostUrl = slugify(host)
</script>

<div class="preview-container">
  <form class="controls" method="post">
    <h1>CONTROLS</h1>
    <div>
      <Input label="Host" type="text" name="host" bind:value={host} />
    </div>
    <div>
      <Input label="Link" type="url" name="link" bind:value={link} />
    </div>
    <div>
      <Input label="Image" type="url" name="image" bind:value={image} />
    </div>
    <!-- TODO: Figure out how to use PaperCSS dark mode for this -->
    <!-- <div>
      <Select label="Text color" name="textColor" bind:value={textColor}>
        <option value="#41403e" default>Black</option>
        <option value="white">White</option>
      </Select>
    </div> -->
    <div>
      <Input
        label="Background color"
        type="color"
        name="backgroundColor"
        bind:value={backgroundColor}
      />
    </div>
    <div>
      <Select
        label="Background effect"
        name="backgroundEffect"
        bind:value={backgroundEffect}
      >
        <option value="">No effect</option>
        <option value="bubbles">Bubbles</option>
      </Select>
    </div>
    <div>
      <Button type="secondary">Submit</Button>
    </div>
  </form>
  <div class="preview">
    <h1>PREVIEW</h1>
    <code>https://scheduleyour.social/with/{hostUrl}</code>
    <div class="page">
      <Page --background={backgroundColor} bind:effect={backgroundEffect}>
        <img src={image} alt="" />
        <h1>Schedule your social</h1>
        <h2 class="font-secondary">
          <!-- TODO: Find out how to make target blank work -->
          with {#if link}<a href={link} target="_blank" class="font-secondary"
              >{host}</a
            >{:else}{host}{/if}
        </h2>
        <p>Let's start with your name</p>

        <form>
          <input
            id="name"
            class="margin-bottom-small"
            name="name"
            style="text-transform: uppercase;"
          />
          <Next disabled={false} />
        </form>
      </Page>
    </div>
  </div>
</div>

<style>
  .preview-container {
    align-items: start;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: space-between;
    min-height: 100vh;
    padding: 1rem;
  }

  .controls div {
    margin: 1rem;
  }

  .preview {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 320px;
    align-self: stretch;
  }

  .preview .page {
    border: 1px solid black;
    border-radius: 8px;
    flex-grow: 1;
    overflow: hidden;
  }

  :global(.controls input) {
    display: block;
  }

  code {
    display: block;
    margin: 0.5rem auto;
    text-align: center;
  }
</style>
