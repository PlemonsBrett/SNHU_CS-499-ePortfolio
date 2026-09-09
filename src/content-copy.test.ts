import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const SOURCE_ROOT = join(process.cwd(), 'src')
const TEXT_EXTENSIONS = new Set(['.astro', '.js', '.mdx', '.svelte', '.ts'])
const TEST_FILE = /\.test\.(js|ts)$/

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(fullPath))
      continue
    }

    const extension = entry.name.slice(entry.name.lastIndexOf('.'))
    if (TEXT_EXTENSIONS.has(extension) && !TEST_FILE.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

describe('portfolio copy', () => {
  const sourceFiles = collectSourceFiles(SOURCE_ROOT)
  const combined = sourceFiles
    .map((filePath) => `${filePath}\n${readFileSync(filePath, 'utf8')}`)
    .join('\n')

  it('does not mention Propio VP or Trent Weston', () => {
    expect(combined).not.toMatch(/Trent Weston/i)
    expect(combined).not.toMatch(/VP of ML/i)
    expect(combined).not.toMatch(/VP of ML and AI/i)
  })

  it('presents the current Principal Software Engineer role', () => {
    expect(combined).toContain('Principal Software Engineer')
    expect(combined).toContain('Quality Estimation')
    expect(combined).toContain('Automated Post-Editing')
  })
})
