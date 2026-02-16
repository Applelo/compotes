import { getCurrentInstance } from 'vue'
import * as Vue from 'vue'

let fallbackId = 0

export function useStableId(prefix: string): string {
  const maybeUseId = (Vue as { useId?: () => string }).useId
  /* istanbul ignore next -- @preserve */
  const baseId = typeof maybeUseId === 'function'
    ? maybeUseId()
    : (getCurrentInstance()?.uid ?? ++fallbackId)

  return `${prefix}-${baseId}`
}
