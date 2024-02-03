# Dropdown Demo

<script setup>
  import './../../packages/core/dist/css/dropdown.css'
  import { Dropdown } from './../../packages/core'
  import { onMounted } from 'vue'

  onMounted(() => {
    const dropdown = new Dropdown('#dropdown', {
      openOn: 'hover'
    })
    const dropdownMenu = new Dropdown('#dropdown-menu')
  })
</script>
<style>
.c-dropdown.c-dropdown, .c-dropdown.c-dropdown ul {
  margin: 0;
  list-style: none;
  padding: 0;
  gap: 10px;
}
.c-dropdown.c-dropdown li {
  margin: 0;
}
</style>
<div class="c-dropdown" id="dropdown" style="margin-top: 2rem;">
  <button>Basic Dropdown</button>
  <div>
    Hello World
  </div>
</div>

<div class="c-dropdown" id="dropdown-menu" style="margin-top: 2rem;">
  <button>Item 1 - Dropdown Menu</button>
  <ul>
    <li><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
  </ul>
</div>
