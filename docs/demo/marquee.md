# Marquee Demo

<script setup>
  import './../../packages/core/dist/css/marquee.css'
  import { Marquee } from './../../packages/core'
  import { onMounted } from 'vue'

  onMounted(() => {
    const marquee = new Marquee('.c-marquee')
  })
</script>
<style>
.c-marquee.c-marquee {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
.c-marquee li + li {
  margin-left: 1rem;
}
</style>
<div style="margin-top: 2rem;">
  <ul class="c-marquee">
    <li>This is a marquee</li>
  </ul>
</div>
