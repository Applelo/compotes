# Dropdown Demo

<script setup>
  import './../../packages/core/dist/css/dropdown.css'
  import { CDropdown, CDropdownTrigger, CDropdownMenu } from './../../packages/vue'
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
<CDropdown id="dropdown" :options="{ openOn: 'hover', equalizeWidth: true }" style="margin-top: 2rem;">
  <CDropdownTrigger>Basic Dropdown</CDropdownTrigger>
  <CDropdownMenu>
    lorem ipseum int
  </CDropdownMenu>
</CDropdown>

<CDropdown id="dropdown-menu" style="margin-top: 2rem;">
  <CDropdownTrigger>Item 1 - Dropdown Menu</CDropdownTrigger>
  <CDropdownMenu as="ul">
    <li><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
  </CDropdownMenu>
</CDropdown>
