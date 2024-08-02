<script>
  import {page} from '$app/stores'
  import ShareButton from '$lib/ShareButton.svelte'
  import {Toast} from 'spaper'
  import {getContext} from 'svelte'

  const {getAnalytics} = getContext('analytics')

  const inviteUrl = new URL('invite', $page.url).href
</script>

<h1>Share the invite link and wait for others to join</h1>
<form style:text-align="center" method="dialog">
  <input id="invite-url" readonly type="url" value={inviteUrl} />
  <ShareButton
    url={inviteUrl}
    shareText="You've been invited to a social!"
    fallback={() => {
      Toast.open({
        message: 'Sharing not available, pleaese copy the link manually',
        type: 'warning',
        position: 'top',
      })
      document.getElementById('invite-url').select()
    }}
    on:click={() => {
      getAnalytics().trackEvent()('Share invite link')
    }}
  />
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
    height: 48px;
  }
</style>
