<script>
  import fantasyBoardGameNight from './(posts)/fantasy-board-games-night.jpeg'
  import {Article, Card, Button} from 'spaper'
  import Footer from '$lib/Footer.svelte'
</script>

<main>
  <h1>Blog</h1>

  <Card
    title="The Ultimate Guide to Hosting a Legendary Board Games Night!"
    subTitle="Written by Daniel Metcalfe on 19 August 2023"
    image={fantasyBoardGameNight}
  >
    Board games night is a time-honored tradition, bringing friends and family
    together for a fun-filled evening of laughter, competition, and
    unforgettable memories.
    <div slot="bottom">
      <Button href="/blog/how-to-host-board-game-night">Read more</Button>
    </div>
  </Card>

  <!-- <Article title="Title" border>
    <span slot="title">
      The Ultimate Guide to Hosting a Legendary Board Games Night!
    </span>
    <p slot="meta">Written by Daniel Metcalfe on 19 August 2023</p>
    <p slot="textLead">
      Board games night is a time-honored tradition, bringing friends and family
      together for a fun-filled evening of laughter, competition, and
      unforgettable memories.
    </p>
    <p slot="footer">
      <a href="/blog/how-to-host-board-game-night">Read More</a>
    </p>

    <img
      class="hero"
      src={fantasyBoardGameNight}
      alt="Hosting a board board games night in a fantasy tavern"
    />
  </Article> -->
</main>
<Footer />

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    max-width: 500px;
    margin: auto;
  }

  :global(.card-text) {
    text-align: left;
    margin: 0;
  }
</style>
