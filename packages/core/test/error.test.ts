import ErrorCompotes from '@src/utils/error'
import { expect, it } from 'vitest'

it('error with message only', () => {
  const error = new ErrorCompotes('test message')
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe('test message')
  expect(error.name).toBe('[compotes]')
})

it('error with message and params', () => {
  const cause = new Error('original')
  const error = new ErrorCompotes('test message', { cause })
  expect(error.message).toBe('test message')
  expect(error.name).toBe('[compotes]')
  expect(error.cause).toBe(cause)
})

it('error with name', () => {
  const error = new ErrorCompotes('test message', {}, 'dropdown')
  expect(error.message).toBe('test message')
  expect(error.name).toBe('[c-dropdown]')
})
