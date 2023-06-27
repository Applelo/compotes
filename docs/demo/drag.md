# Drag Demo

<script setup>
  import './../../packages/core/dist/css/drag.css'
  import { Drag } from './../../packages/core'
  import { onMounted } from 'vue'

  onMounted(() => {
    const drag = new Drag('.c-drag')
  })
</script>
<style>
.c-drag {
  height: 250px;
}

.c-drag > div {
  width: 200%;
}

.c-drag p:first-child {
  width: 300px;
}
</style>
<div style="margin-top: 2rem;">
  <div class="c-drag">
    <div>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus. Ad et qui labore reprehenderit magnam exercitationem placeat magni nesciunt suscipit.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus. Ad et qui labore reprehenderit magnam exercitationem placeat magni nesciunt suscipit.
      </p>
    </div>
  </div>
</div>
