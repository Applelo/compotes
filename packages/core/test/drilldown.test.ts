import type { Events } from '@src/components/drilldown'
import Drilldown from '@src/components/drilldown'
import { beforeAll, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { registerEventListeners } from './helper'
import '@css/drilldown.css'

type DrilldownEvents = `c.drilldown.${Events}`

let bodyHTML: string = ''

beforeAll(() => {
  const html = `
  <div>
    <nav class="c-drilldown" data-testid="drilldown" style="">
      <ul class="c-drilldown-menu" data-testid="root-menu" style="">
        <li>
          <button class="c-drilldown-next" data-testid="next-1">
            Go to section 1
          </button>
          <ul class="c-drilldown-menu" id="section-1" data-testid="section-1">
            <li>
              <button class="c-drilldown-back" data-testid="back-1">
                Go Back
              </button>
            </li>
            <li>
              <button class="c-drilldown-next" data-testid="next-1-1">
                Go to section 1 1
              </button>
              <ul class="c-drilldown-menu" data-testid="section-1-1">
                <li>
                  <button class="c-drilldown-back" data-testid="back-1-1">
                    Go Back
                  </button>
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
          <button class="c-drilldown-next" data-testid="next-2">
            Go to section 2
          </button>
          <ul class="c-drilldown-menu" id="section-2" data-testid="section-2">
            <li>
              <button class="c-drilldown-back" data-testid="back-2">
                Go Back
              </button>
            </li>
            <li>
              Item Section 2
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
`
  document.body.innerHTML = html
  bodyHTML = document.body.innerHTML

  return () => {
    expect(bodyHTML).toBe(document.body.innerHTML)
  }
})

it('drilldown', async () => {
  const drilldownLoc = page.getByTestId('drilldown')
  const rootMenuLoc = page.getByTestId('root-menu')
  const next1Loc = page.getByTestId('next-1')
  const next11Loc = page.getByTestId('next-1-1')
  const back11Loc = page.getByTestId('back-1-1')
  const section1Loc = page.getByTestId('section-1')
  const section11Loc = page.getByTestId('section-1-1')

  expect(drilldownLoc).toBeInTheDocument()
  expect(next1Loc).toBeInTheDocument()
  expect(section1Loc).toBeInTheDocument()

  const { callback: updateEvent, removeEventListener: removeUpdateEvent } = registerEventListeners<DrilldownEvents>('c.drilldown.update', drilldownLoc)
  const { callback: nextEvent, removeEventListener: removeNextEvent } = registerEventListeners<DrilldownEvents>('c.drilldown.next', drilldownLoc)
  const { callback: backEvent, removeEventListener: removeBackEvent } = registerEventListeners<DrilldownEvents>('c.drilldown.back', drilldownLoc)
  const { callback: resetEvent, removeEventListener: removeResetEvent } = registerEventListeners<DrilldownEvents>('c.drilldown.reset', drilldownLoc)

  const drilldown = new Drilldown(drilldownLoc.element() as HTMLElement)

  expect(rootMenuLoc.element()).toMatchSnapshot()

  expect(section1Loc).not.toBeVisible()
  expect(section11Loc).not.toBeVisible()

  // Navigate to section 1
  await userEvent.click(next1Loc)
  expect(section1Loc).toBeVisible()
  expect(nextEvent).toHaveBeenCalledTimes(1)
  expect(updateEvent).toHaveBeenCalledTimes(1)

  // Navigate to section 1 1
  await userEvent.click(next11Loc)
  expect(section11Loc).toBeVisible()
  expect(nextEvent).toHaveBeenCalledTimes(2)
  expect(updateEvent).toHaveBeenCalledTimes(2)

  // Back one level
  await userEvent.click(back11Loc)
  expect(section11Loc).not.toBeVisible()
  expect(backEvent).toHaveBeenCalledTimes(1)
  expect(updateEvent).toHaveBeenCalledTimes(3)

  // Reset to root
  drilldown.reset()
  expect(resetEvent).toHaveBeenCalledTimes(1)
  expect(updateEvent).toHaveBeenCalledTimes(4)
  expect(section1Loc).not.toBeVisible()

  drilldown.destroy()

  removeUpdateEvent()
  removeNextEvent()
  removeBackEvent()
  removeResetEvent()
})
