import { describe, expect, it } from 'vitest'
import { siteConfig } from './site.js'

describe('siteConfig owner identity', () => {
  it('uses the Principal Software Engineer title', () => {
    expect(siteConfig.owner.title).toBe('Principal Software Engineer')
  })

  it('lists translation-system SME areas in the tagline', () => {
    const { tagline } = siteConfig.owner

    expect(tagline).toContain('Principal Software Engineer')
    expect(tagline).toContain('Quality Estimation')
    expect(tagline).toContain('Automated Post-Editing')
    expect(tagline).toContain('Machine Translation')
    expect(tagline).toContain('TBX')
    expect(tagline).toContain('Translation System Design')
  })

  it('keeps the site description aligned with the current role', () => {
    expect(siteConfig.branding.siteDescription).toBe(siteConfig.owner.tagline)
  })
})
