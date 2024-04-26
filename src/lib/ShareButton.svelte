<script>
  import {Button, Modal, Toast} from 'spaper'
  import ShareIcon from '$lib/ShareIcon.svelte'

  export let url
  export let shareText
  export let fallback = () => {
    Modal.open({
      title: 'Copy the below link and share it with your friends!',
      content: url,
    })
  }

  async function share() {
    try {
      await navigator.share({
        title: 'Schedule Your Social',
        text: shareText,
        url,
      })
      console.debug('native')
    } catch (error) {
      console.warn('Unable to use native sharing', error)
      if (error.name === 'AbortError') return // If we try to fallback to 'copy' after this it results in a NotAllowedErorr. I'm guesing this is because when the user aborts share it resets Safari's concept of if is a valid and safe clipboard operation triggered by a user interaction (see https://webkit.org/blog/10247/new-webkit-features-in-safari-13-1/).

      try {
        await copy()
        Toast.open({
          message: 'Link copied to clipiboard',
          type: 'success',
          position: 'top',
        })
        console.debug('auto copy with dialog')
      } catch (error) {
        // One example of when this would happen is in some Android Webviews that don't provide copy permissions.
        console.warn('Unable to copy to clipboard', error)
        console.debug('manual copy with dialog')
        fallback()
      }
    }
  }

  async function copy() {
    if (!navigator.clipboard)
      throw new Error('Navigator clipboard not available')
    await navigator.clipboard.writeText(url)
  }
</script>

<Button on:click={share} type="success">
  <span style:margin-right="0.2rem">
    <slot />
  </span>
  <ShareIcon />
</Button>
