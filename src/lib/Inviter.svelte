<script>
  import {Button, Toast} from 'spaper'
  import ShareIcon from '$lib/ShareIcon.svelte'
  import {page} from '$app/stores'
  import {getContext} from 'svelte'

  const {getAnalytics} = getContext('analytics')

  const inviteUrl = new URL('invite', $page.url).href

  async function share() {
    try {
      await navigator.share({
        title: 'Schedule Your Social',
        text: "You've been invited to a social!",
        url: inviteUrl,
      })
      trackShareInviteLink('native')
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
        trackShareInviteLink('auto copy with dialog')
      } catch (error) {
        // One example of when this would happen is in some Android Webviews that don't provide copy permissions.
        console.warn('Unable to copy to clipboard', error)
        Toast.open({
          message: 'Sharing not available, pleaese copy the link manually',
          type: 'warning',
          position: 'top',
        })
        trackShareInviteLink('manual copy with dialog')
      }
      displayInviteUrlDialog()
    }
  }

  async function copy() {
    if (!navigator.clipboard)
      throw new Error('Navigator clipboard not available')
    await navigator.clipboard.writeText(inviteUrl)
  }

  function displayInviteUrlDialog() {
    document.getElementById('invite-url').select()
  }

  function trackShareInviteLink(method) {
    getAnalytics().trackEvent('Share invite link', {
      props: {
        method,
      },
    })
  }
</script>

<h1>Copy the invite link and wait for others to join</h1>
<form style:text-align="center" method="dialog">
  <input id="invite-url" readonly type="url" value={inviteUrl} />
  <Button on:click={share} type="success">
    <ShareIcon />
  </Button>
</form>

<style>
  h1 {
    font-size: 1.61em;
  }

  form {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin: 1rem;
    width: 100%;
  }

  input {
    flex-grow: 1;
    max-width: 45ch;
    text-align: center;
  }
</style>
