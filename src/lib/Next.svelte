<script>
	export let disabled
	export let form
</script>


<button class="next" {disabled} form={form} type="submit">NEXT</button>

<style>
	.next {
		background-color: greenyellow;
		min-width: 3rem;
	}
</style>
