# Drilldown Demo

<script setup>
  import './../../packages/core/dist/css/drilldown.css'
  import {
    CDrilldown,
    CDrilldownMenu,
    CDrilldownNext,
    CDrilldownBack
  } from './../../packages/vue'
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
<CDrilldown style="margin-top: 2rem;" :options="{ dynamicHeight: true }">
  <CDrilldownMenu>
    <li>
      <CDrilldownNext>
        Go to section 1
      </CDrilldownNext>
      <CDrilldownMenu id="section-1">
        <li>
          <CDrilldownBack>
            Go Back
          </CDrilldownBack>
        </li>
        <li>
          <CDrilldownNext>
            Go to section 1 1
          </CDrilldownNext>
          <CDrilldownMenu id="section-1-1">
            <li>
              <CDrilldownBack>
                Go Back
              </CDrilldownBack>
            </li>
            <li>
              Item Section 1 1
            </li>
            <li>
              Item Section 1 1
            </li>
          </CDrilldownMenu>
        </li>
        <li>
          Item Section 1
        </li>
      </CDrilldownMenu>
    </li>
    <li>
      Hello
    </li>
    <li>
      <CDrilldownNext>
        Go to section 2
      </CDrilldownNext>
      <CDrilldownMenu id="section-2">
        <li>
          <CDrilldownBack>
            Go Back
          </CDrilldownBack>
        </li>
        <li>
          Item Section 2
        </li>
        <li>
          Item Section 2
        </li>
      </CDrilldownMenu>
    </li>
    <li>
      <CDrilldownNext>
        Go to section 3
      </CDrilldownNext>
      <CDrilldownMenu id="section-3">
        <li>
          <CDrilldownBack>
            Go Back
          </CDrilldownBack>
        </li>
        <li>
          Item Section 3
        </li>
        <li>
          Item Section 3
        </li>
      </CDrilldownMenu>
    </li>
    <li>
      Item
    </li>
  </CDrilldownMenu>
</CDrilldown>
