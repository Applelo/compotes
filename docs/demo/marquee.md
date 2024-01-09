# Marquee Demo

<script setup>
  import './../../packages/core/dist/css/marquee.css'
  import { Marquee } from './../../packages/core'
  import { onMounted } from 'vue'

  onMounted(() => {
    // const marqueeDefault = new Marquee('#marquee-default')
    const marqueeLeft = new Marquee('#marquee-left', {
      direction: 'left',
      fill: true
    })
    const marqueeDown = new Marquee('#marquee-down', {
      direction: 'down',
      fill: true
    })
    const marqueeAlternateEl = document.getElementById('marquee-alternate')
    const marqueeAlternate = new Marquee(marqueeAlternateEl, {
      behavior: 'alternate'
    })
  })
</script>
<style>
.c-marquee .c-marquee-container {
  list-style: none;
  padding-left: 0;
  margin: 0!important;
}
.c-marquee li {
  margin: 0!important;
  padding: 0 .5rem;
}
</style>
<!-- <div id="marquee-default" class="c-marquee" style="margin-top: 2rem;">
  <ul class="c-marquee-container">
    <li>This is the default marquee</li>
    <li>Marquee or marquii</li>
  </ul>
</div> -->
<div id="marquee-left" class="c-marquee" style="margin-top: 2rem;">
  <ul class="c-marquee-container">
    <li>Marquee Left Direction</li>
  </ul>
</div>
<div id="marquee-down" class="c-marquee" style="margin-top: 2rem; height: 500px;">
  <ul class="c-marquee-container">
    <li>Marquee Bottom Direction</li>
  </ul>
</div>
<div id="marquee-alternate" class="c-marquee" style="margin-top: 2rem; width: 100px;">
  <ul class="c-marquee-container">
    <li>Alternate</li>
  </ul>
</div>
