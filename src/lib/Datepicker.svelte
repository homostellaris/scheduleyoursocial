<script context="module">
  import Datepicker from 'praecox-datepicker'
</script>

<script>
  import {toDateString} from './date'

  export let marked
  export let selected
  export let disabledTo = -1

  const _marked = marked.map(date => new Date(date).getTime())
  let _selected = selected.map(date => new Date(date).getTime())

  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() + disabledTo)

  $: selected = _selected.map(toDateString)
</script>

<div class="datepicker">
  <Datepicker
    disabled={['1970-01-01', yesterday]}
    finishBtn={false}
    marked={_marked}
    pickerRule={'free'}
    bind:selected={_selected}
  />
</div>

<style>
  :global(.calendar *) {
    font-family: 'Port Lligat Slab', serif;
    font-size: 21px;
  }
  :global(.calendar-date) {
    border-radius: 25px;
  }

  :global(.calendar-dayOfWeek) {
    font-size: 16px;
  }

  :global(.is-focused::before) {
    content: '👑' !important;
    background-color: unset !important;
    width: 2px !important;
    height: 2px !important;
    font-size: 15px;
    line-height: calc(
      0.01 *
        var(--praecox-calendar-custom-height, var(--praecox-calendar-height))
    );
    top: 0 !important;
    left: 0 !important;
  }

  .datepicker {
    --praecox-calendar-custom-font-family: 'Port Lligat Slab', serif;
    --praecox-calendar-custom-number-font-family: 'Port Lligat Slab', cursive;
    --praecox-calendar-custom-font-main-color: #181818;
    --praecox-calendar-custom-border-radius: 25px;
    --praecox-calendar-custom-inner-width: min(80vw, 230px);
    --praecox-calendar-custom-inner-height: min(80vw, 230px);
    --praecox-calendar-custom-width: calc(
      var(--praecox-calendar-custom-inner-width) + 48px
    );
    --praecox-calendar-custom-height: calc(
      var(--praecox-calendar-custom-inner-height) + 64px
    );
    --praecox-calendar-custom-background: rgba(255, 255, 255, 0.8);
    --praecox-calendar-custom-weekend-color: none;
  }

  :global(table tbody tr td) {
    border-top: none;
  }
</style>
