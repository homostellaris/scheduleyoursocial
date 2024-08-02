<script>
  import logo from '$lib/liquid death.jpg'
  import {getContext} from 'svelte'

  const {getAnalytics} = getContext('analytics')
</script>

<p
  style:font-family="'Amatic SC', cursive"
  style:font-size="1.15rem"
  style:margin-top="2rem"
  style:margin-bottom="0"
>
  Consider a tasty non-alcoholic beverage for your social. Purchases help
  support development.
</p>
<a
  href="https://amzn.to/4dpshsU"
  on:click={() => {
    getAnalytics().trackEvent('Liquid Death link clicked')
  }}
  target="_blank"
>
  <figure>
    <img
      src="https://m.media-amazon.com/images/I/71pCzc0NH4L.jpg"
      alt="Liquid Death Still Mountain Water, 12 x 500 ml"
      style:max-height="20vh"
      style:margin="auto"
    />
    <figcaption
      style="margin: 0.5rem; text-align: center;"
      style:font-family="'Port Lligat Slab', serif"
    >
      Liquid Death - "Murder Your Thirst"
    </figcaption>
  </figure>
</a>
