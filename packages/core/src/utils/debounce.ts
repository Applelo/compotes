export function debounceResizeObserver(callback: (entries: ResizeObserverEntry[]) => void, delay: number = 100): ResizeObserver {
  let timeoutId: number | null = null
  let firstTime = true
  return new ResizeObserver((entries) => {
    if (firstTime) {
      callback(entries)
      firstTime = false
      return
    }
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId)
    }
    timeoutId = window.setTimeout(() => {
      callback(entries)
      timeoutId = null
    }, delay)
  })
}

export function debounceMutationObserver(callback: (records: MutationRecord[]) => void, delay: number = 100): MutationObserver {
  let timeoutId: number | null = null
  let firstTime = true
  return new MutationObserver((records) => {
    if (firstTime) {
      callback(records)
      firstTime = false
      return
    }
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId)
    }
    timeoutId = window.setTimeout(() => {
      callback(records)
      timeoutId = null
    }, delay)
  })
}
