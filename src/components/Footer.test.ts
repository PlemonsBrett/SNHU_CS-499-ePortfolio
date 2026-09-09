import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const footerSource = readFileSync(join(process.cwd(), 'src/components/Footer.astro'), 'utf8')
const layoutSource = readFileSync(join(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf8')

describe('Footer styling', () => {
  it('is a static Astro component so layout CSS is included without client hydration', () => {
    expect(layoutSource).toContain("import Footer from '../components/Footer.astro'")
    expect(layoutSource).toContain('<Footer />')
    expect(layoutSource).not.toContain('Footer.svelte')
    expect(layoutSource).not.toMatch(/<Footer\s+client:/)
  })

  it('defines a full footer layout instead of relying on unstyled defaults', () => {
    expect(footerSource).toContain('grid-template-columns: 2fr 1fr 1fr')
    expect(footerSource).toContain('background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)')
    expect(footerSource).toContain('display: flex')
    expect(footerSource).toContain('flex-direction: column')
  })

  it('keeps quick links in a spaced column so labels do not run together', () => {
    expect(footerSource).toMatch(/\.footer-nav\s*\{[^}]*flex-direction:\s*column;/s)
    expect(footerSource).toMatch(/\.footer-nav\s*\{[^}]*gap:\s*0\.5rem;/s)
  })
})
