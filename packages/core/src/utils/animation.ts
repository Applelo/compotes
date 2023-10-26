/**
 * From bootstrap
 * @see https://github.com/twbs/bootstrap/blob/main/js/src/util/index.js
 */
export function getTransitionDuration(el: HTMLElement) {
  let { transitionDuration, transitionDelay } = window.getComputedStyle(el)

  const floatTransitionDuration = Number.parseFloat(transitionDuration)
  const floatTransitionDelay = Number.parseFloat(transitionDelay)

  // Return 0 if element or transition duration is not found
  if (!floatTransitionDuration && !floatTransitionDelay)
    return 0

  // If multiple durations are defined, take the first
  transitionDuration = transitionDuration.split(',')[0]
  transitionDelay = transitionDelay.split(',')[0]

  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * 1000
}
