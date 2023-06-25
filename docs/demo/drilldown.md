# Drilldown Demo

<script setup>
  import './../../packages/core/dist/css/drilldown.css'
  import { Drilldown } from './../../packages/core'
  import { onMounted } from 'vue'

  onMounted(() => {
    const drilldown = new Drilldown('.c-drilldown', {
      dynamicHeight: true,
    })
  })
</script>
<style>
  .c-drilldown .c-drilldown-menu {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  .c-drilldown-next {
    color: var(--vp-c-brand);
  }

  .c-drilldown-back {
    color: var(--vp-c-brand-light);
  }
</style>
<nav style="margin-top: 2rem;" class="c-drilldown">
  <ul class="c-drilldown-menu">
    <li>
      <button class="c-drilldown-next">
        Go to section 1
      </button>
      <ul class="c-drilldown-menu" id="section-1">
        <li>
          <button class="c-drilldown-back">
            Go Back
          </button>
        </li>
        <li>
          <button class="c-drilldown-next">
            Go to section 1 1
          </button>
          <ul class="c-drilldown-menu" id="section-1-1">
            <li>
              <button class="c-drilldown-back">
                Go Back
              </button>
            </li>
            <li>
              Item Section 1 1
            </li>
            <li>
              Item Section 1 1
            </li>
          </ul>
        </li>
        <li>
          Item Section 1
        </li>
      </ul>
    </li>
    <li>
      Hello
    </li>
    <li>
      <button class="c-drilldown-next">
        Go to section 2
      </button>
      <ul class="c-drilldown-menu" id="section-2">
        <li>
          <button class="c-drilldown-back">
            Go Back
          </button>
        </li>
        <li>
          Item Section 2
        </li>
        <li>
          Item Section 2
        </li>
      </ul>
    </li>
    <li>
      <button class="c-drilldown-next">
        Go to section 3
      </button>
      <ul class="c-drilldown-menu" id="section-3">
        <li>
          <button class="c-drilldown-back">
            Go Back
          </button>
        </li>
        <li>
          Item Section 3
        </li>
        <li>
          Item Section 3
        </li>
      </ul>
    </li>
    <li>
      Item
    </li>
  </ul>
</nav>