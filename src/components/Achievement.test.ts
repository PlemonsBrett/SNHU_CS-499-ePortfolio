import { describe, it, expect } from 'vitest'
import Achievement from './Achievement.svelte'

describe('Achievement Component', () => {
  it('should be importable', () => {
    expect(Achievement).toBeDefined()
  })

  it('should have a valid component structure', () => {
    expect(Achievement).toBeTruthy()
    expect(typeof Achievement).toBe('function')
  })
})