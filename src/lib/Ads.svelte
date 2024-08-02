<script>
  import liquidDeath from '$lib/liquid death.jpg'
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
  href="https://www.amazon.com/Liquid-Death-Squeezed-Sparkling-Sweetened/dp/B0CV4MCM91?crid=22U074H84ZC36&dib=eyJ2IjoiMSJ9.pT7IMTvtK8Opux2I83EFFj5eG6XaUv8Unt-qB2VpoikB85kTSjJ26A00VmKb0DCghWD-Txi9hc8ziGpGEOeR_veM1PEOrkuVWbYRcPNyOlfGT7001KpDKfHBNY-_inMEbpzExnzN6UENQxLqSQsW1YidM7D_L-pVM7bzCLj27uuBcHDRcZTv5B06BxP6KrkH3O1HeCGtbRFyLrrULtgsagw4pDDCNDcmbjSWHZUL7zDUtuI0t7nAM3blY_KuwygnHa1AWAf8QIQub-hijptbBjBlooK3H9fckwAGn4vBO7k._Z43AazpptNX9xPxKKmv9KGepQvyQ1eIXJqtQx_oaLg&dib_tag=se&keywords=liquid+death&qid=1722633813&sprefix=liquid+dea%2Caps%2C279&sr=8-1&linkCode=ll1&tag=scheduleyours-20&linkId=8676ff9e6324d307e0c9190024e709b5&language=en_US&ref_=as_li_ss_tl"
  on:click={() => {
    getAnalytics().trackEvent('Liquid Death link clicked')
  }}
  target="_blank"
>
  <figure>
    <img
      src={liquidDeath}
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
