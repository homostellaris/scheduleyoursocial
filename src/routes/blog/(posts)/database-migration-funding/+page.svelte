<script>
  import {Button, Hero, Article} from 'spaper'
  import Todo from '$lib/Todo.svelte'
  import fantasyBoardGameNight from '../fantasy-board-games-night.jpeg'
  import competitiveGimli from '../competitive-gimli.gif'
  import Logo from '$lib/Logo.svelte'
  import {getContext} from 'svelte'

  const {getAnalytics} = getContext('analytics')
</script>

<svelte:head>
  <title>Database migration funding request</title>
  <meta
    name="description"
    content="Advice for those looking to host a board games night with board game suggestions and more."
  />
</svelte:head>

<Article>
  <span slot="title"> Database migration funding request </span>
  <p slot="meta">Written by Daniel Metcalfe on 24 March 2025</p>
  <p slot="textLead">
    We need one-off donations to support a database migration.
  </p>
  <p>
    Thanks for clicking. This is a hobby project that I don't currently earn any
    money from and have put a lot of my own time into. Although I love this
    project and have many ideas for it I still have to justify the time
    investment to some extent.
  </p>
  <p>
    I recently learned that <a href="https://fauna.com/">FaunaDB</a>, the
    serverless database service which Schedule Your Social relies on, is being
    discontinued and
    <a href="https://fauna.com/blog/the-future-of-fauna"
      >will cease operations on May 30th</a
    >.
  </p>
  <p>
    It will probably take me about two days to migrate to another database
    service which isn't a trivial time investment as I work full time and am a
    father of two.
  </p>
  <p>
    If I can get $200 or more in donations I'll consider this worth the time and
    will also take that as a signal that people get value from this app and
    consider building some more features that I have in mind.
  </p>
  <p>
    If I get a few donations and its not close to $200 then I probably won't be
    doing the migration, at least not anytime soon, and will refund those
    donations which are made.
  </p>
  <div style:text-align="center">
    <Button
      type="success"
      on:click={() => {
        getAnalytics().trackEvent('Database migration donation button clicked')
        document.querySelector('#bmc-wbtn').onclick()
      }}>Donate</Button
    >
  </div>
  <p>Thank you very much for using my product and considering donating 🙏</p>
  <p>
    If you have any feedback on the product then please get in touch using one
    of the contact options available on my <a href="https://homostellaris.io"
      >link-in-bio</a
    >.
  </p>
</Article>
