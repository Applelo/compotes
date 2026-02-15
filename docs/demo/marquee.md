# Marquee Demo

<script setup>
  import './../../packages/core/dist/css/marquee.css'
  import { CMarquee } from './../../packages/vue'
</script>
<style>
.c-marquee .c-marquee-container {
  list-style: none;
  padding: 0;
  margin: 0;
}
.c-marquee li {
  margin: 0!important;
  padding: 0 .5rem;
}
</style>
<CMarquee :options="{ fill: true }" style="margin-top: 2rem;">
  <li>This is the default <a href="#">marquee</a></li>
  <li>Marquee or <a href="#">marquii</a></li>
</CMarquee>
<CMarquee :options="{ direction: 'left', fill: true }" style="margin-top: 2rem;">
  <li>Marquee Left Direction</li>
  <li><img width="25" height="25" src="https://vitejs.dev/logo.svg"/></li>
</CMarquee>
<CMarquee :options="{ direction: 'down', fill: true }" style="margin-top: 2rem; height: 500px;">
  <li>Marquee Bottom Direction</li>
</CMarquee>
<CMarquee :options="{ behavior: 'alternate' }" style="margin-top: 2rem; width: 100px;">
  <li>Alternate</li>
</CMarquee>
