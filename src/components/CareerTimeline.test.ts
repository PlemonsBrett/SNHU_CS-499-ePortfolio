import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const timelineSource = readFileSync(
  join(process.cwd(), 'src/components/CareerTimeline.svelte'),
  'utf8'
)

describe('CareerTimeline alignment', () => {
  it('centers the timeline line without a transform so GSAP can scale it', () => {
    expect(timelineSource).toMatch(/\.timeline-line\s*\{[^}]*left:\s*50%;/s)
    expect(timelineSource).toMatch(/\.timeline-line\s*\{[^}]*margin-left:\s*-1px;/s)
    expect(timelineSource).not.toMatch(/\.timeline-line\s*\{[^}]*transform:\s*translateX\(-50%\)/s)
  })

  it('pins event dots to the center line instead of percentage offsets from each card', () => {
    expect(timelineSource).toMatch(/\.event-dot\s*\{[^}]*left:\s*50%;/s)
    expect(timelineSource).toMatch(/\.event-dot\s*\{[^}]*margin-left:\s*-10px;/s)
    expect(timelineSource).toMatch(/\.timeline-event\s*\{[^}]*box-sizing:\s*border-box;/s)
    expect(timelineSource).not.toMatch(/padding-right:\s*calc\(50%/)
    expect(timelineSource).not.toMatch(/right:\s*-12\.5%/)
    expect(timelineSource).not.toMatch(/left:\s*-12\.5%/)
  })

  it('animates event cards rather than the row that contains the dots', () => {
    expect(timelineSource).toMatch(/querySelectorAll\(`#\$\{id\} \.event-content`\)/)
    expect(timelineSource).not.toMatch(/querySelectorAll\(`#\$\{id\} \.timeline-event`\)/)
  })
})
