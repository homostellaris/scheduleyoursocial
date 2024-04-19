<script>
  import {dev} from '$app/environment'
  import * as Sentry from '@sentry/browser'
  import Plausible from 'plausible-tracker'
  import {onMount, setContext} from 'svelte'

  let plausible

  setContext('analytics', {
    getAnalytics: () => plausible,
    getFeedback: () => feedback,
  })

  onMount(() => {
    const feedback = Sentry.feedbackIntegration({
      autoInject: false,
      colorScheme: 'dark',
      buttonLabel: 'Leave feedback',
      showName: false,
      emailPlaceholder: 'May be used to follow up on your feedback',
      submitButtonLabel: 'Submit feedback',
      formTitle: 'Leave feedback',
      messageLabel: 'Feedback',
      messagePlaceholder:
        "Bug reports, feature requests, or anything else you want to tell us; don't hold back.",
      showBranding: false,
      successMessageText: 'We appreciate it you taking the time to do that 🙏',
    })
    Sentry.init({
      dsn: 'https://5b7a4ba6b3ff446ea520d3b5d7b854f2@o1232542.ingest.sentry.io/6380542',
      integrations: [Sentry.browserTracingIntegration(), feedback],
      tracesSampleRate: 1.0,
      enabled: !dev && document.location.hostname === 'scheduleyour.social', // TODO: Expose CI env var here instead of checking hostname
    })
    feedback.attachTo(document.getElementById('feedback')) // This is in Footer

    // TODO: Raise a PR to define exports properly so this works with Vite.
    plausible = Plausible()
    plausible.enableAutoPageviews()
    plausible.enableAutoOutboundTracking()
  })
</script>

<slot />

<style>
  :root {
    --background: linear-gradient(
      to right,
      rgba(192, 86, 0, 1) 0%,
      rgba(220, 112, 0, 1) 21%,
      rgba(232, 124, 0, 1) 51%,
      rgba(232, 124, 0, 1) 81%,
      rgba(220, 112, 0, 1) 100%
    );
    --beer: #e87c00;
    --light-beer: rgba(255, 156, 26, 0.836);
    --good: #adff2f;
    --bad: red;
    --white: #fff;
    --purple: rgb(85, 26, 139);
    --pink: rgba(218, 88, 218, 0.747);

    /* Paper CSS overrides */
    /* --primary: var(--purple); */
    /* --primary-light: var(--light-beer); */
    /* --secondary: var(--pink); */
    /* --success: #608d1c; */
    /* --success-light: var(--good); */
    /* --main-background: #ecb473; */
  }

  :global(#sentry-feedback) {
    --font-family: 'Port Lligat Slab', serif;
    --top: auto;
    --right: calc(50% - 160px);
    --bottom: auto;
    --left: calc(50% - 160px);
  }

  :global(
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 html,
      body,
      button,
      span,
      applet,
      object,
      iframe,
      blockquote,
      pre,
      a,
      abbr,
      acronym,
      address,
      big,
      cite,
      code,
      del,
      dfn,
      em,
      img,
      ins,
      kbd,
      q,
      s,
      samp,
      small,
      strike,
      strong,
      sub,
      sup,
      tt,
      var,
      b,
      u,
      i,
      center,
      dl,
      dt,
      dd,
      ol,
      ul,
      li,
      fieldset,
      form,
      legend,
      table,
      caption,
      tbody,
      tfoot,
      thead,
      tr,
      th,
      td,
      article,
      aside,
      canvas,
      details,
      embed,
      figure,
      figcaption,
      footer,
      header,
      hgroup,
      menu,
      nav,
      output,
      ruby,
      section,
      summary,
      time,
      mark,
      audio,
      video
    ) {
    font-family: 'Amatic SC', cursive;
    /* color: var(--primary); */
  }

  :global(p, label, input) {
    font-family: 'Port Lligat Slab', serif;
    /* color: var(--primary); */
  }

  :global(.font-primary) {
    font-family: 'Amatic SC', cursive;
  }
  :global(.font-secondary) {
    font-family: 'Port Lligat Slab', serif;
  }

  :global(code) {
    font-family: monospace;
  }

  :global(html) {
    /* font-size: calc(1em + 0.5vw); */
    height: 100%;
    width: 100%;
  }

  :global(body) {
    position: relative;
    height: 100%;
    width: 100%;
  }

  :global(h1, h2, h3, p, button, li) {
    /* font-size: x-large; */
    text-align: center;
  }

  :global(h1) {
    font-size: 4.17em;
    font-weight: 700;
  }

  @media (max-width: 500px) {
    :global(h1) {
      font-size: 3em;
      font-weight: 700;
    }
  }

  :global(h2) {
    font-size: 2.59em;
  }

  :global(h3) {
    font-size: 1.61em;
  }

  :global(p) {
    font-size: 1em;
    max-width: 900px;
    margin: 1em;
  }

  :global(span) {
    font-size: 1em;
  }

  :global(li) {
    text-align: left;
    margin: 1em;
  }

  :global(button) {
    /* cursor: pointer; */
    font-weight: bold;
  }

  :global(button:disabled) {
    filter: saturate(30%);
  }

  :global(input, button) {
    background-color: white;
    /* color: black; */
    display: inline-block;
    font-size: 1em;
  }

  :global(a) {
    background-image: none;
    text-decoration-color: rgb(0, 0, 238);
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-thickness: auto;
  }

  :global(.paper-btn, [type='button'], button) {
    padding: 0.5rem;
  }

  :global(h1) {
    margin: 0;
  }

  :global(h2) {
    margin: 0;
  }
</style>
