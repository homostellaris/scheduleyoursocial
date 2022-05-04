<script>
	import { page } from '$app/stores'
	import {getContext} from 'svelte'

	const {getAnalytics} = getContext('analytics')

	const inviteUrl = $page.url.origin + '/' + $page.params.socialId + '/invite'
	let inviteDialogText = "Please copy this link"

	async function share () {
		try {
			await navigator.share({
				title: "Schedule Your Social",
				text: "You've been invited to a social!",
				url: inviteUrl,
			})
			trackShareInviteLink('native')
		} catch (error) {
			console.warn('Unable to use native sharing', error)
			if (error.name === 'AbortError') return // If we try to fallback to 'copy' after this it results in a NotAllowedErorr. I'm guesing this is because when the user aborts share it resets Safari's concept of if is a valid and safe clipboard operation triggered by a user interaction (see https://webkit.org/blog/10247/new-webkit-features-in-safari-13-1/).

			try {
				await copy()
				inviteDialogText = "This link has been copied to your clipboard"
				trackShareInviteLink('auto copy with dialog')
			} catch (error) {
				// One example of when this would happen is in some Android Webviews that don't provide copy permissions.
				console.warn('Unable to copy to clipboard', error)
				inviteDialogText = "Please copy this link"
				trackShareInviteLink('manual copy with dialog')
			}
			displayInviteUrlDialog(inviteDialogText)
		}
	}

	async function copy () {
		if (!navigator.clipboard) throw new Error('Navigator clipboard not available')
		await navigator.clipboard.writeText(inviteUrl)
	}

	function displayInviteUrlDialog () {
		document.getElementById('invite-dialog').showModal()
		document.getElementById('invite-url').select()
	}

	function trackShareInviteLink (method) {
		getAnalytics().trackEvent(
			'Share invite link',
			{
				props: {
					method,
				}
			}
		)
	}
</script>

<button on:click={share}>SHARE INVITE LINK</button>
<dialog id="invite-dialog">
	<p>{inviteDialogText}</p>
	<form method="dialog">
		<input id="invite-url" readonly type="url" value={inviteUrl}>
		<button value="cancel">Done</button>
	</form>
</dialog>

<style>
	button {
		background-color: greenyellow;
	}

	#invite-url {
		text-align: center;
		width: 45ch;
	}
</style>