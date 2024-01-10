# Drag Demo

<script setup>
  import './../../packages/core/dist/css/drag.css'
  import { Drag } from './../../packages/core'
  import { onMounted } from 'vue'

  onMounted(() => {
    const dragBasic = new Drag('#drag-basic')
    const dragBreadcrumb = new Drag('#drag-breadcrumb')
  })
</script>
<style>
/* basic */
#drag-basic {
  height: 250px;
}

#drag-basic > div {
  width: 200%;
}

#drag-basic p:first-child {
  width: 300px;
}

/* breadcrumb */
#drag-breadcrumb ul {
  list-style: none;
  margin: 2rem 0 0;
  padding: 1rem 0;
  display:flex;
  gap: 1rem;
}

#drag-breadcrumb li {
  margin: 0;
  flex-shrink: 0;
}
</style>
<div style="margin-top: 2rem;">
  <div class="c-drag" id="drag-basic">
    <div>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus. Ad et qui labore reprehenderit magnam exercitationem placeat magni nesciunt suscipit.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia facere possimus impedit facilis culpa illo earum deserunt consequuntur minus. Ad et qui labore reprehenderit magnam exercitationem placeat magni nesciunt suscipit.
      </p>
    </div>
  </div>

  <div class="c-drag" id="drag-breadcrumb">
    <ul>
      <li><a target="_blank" href="https://www.alexandregaliay.com/">Lorem ipsum Alexgolia</a></li>
      <li><a href="#2">Mollitia facere</a></li>
      <li><a target="_blank" href="https://camilles-travels.com/">Camille san et qui labore reprehenderit</a></li>
      <li><a href="#4">Mollitia facere</a></li>
    </ul>
  </div>
</div>
