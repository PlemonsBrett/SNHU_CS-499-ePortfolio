import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('pnpm workspace config', () => {
  it('declares a packages field so pnpm 9 and GitHub Pages deploy can install', () => {
    const workspace = readFileSync(join(process.cwd(), 'pnpm-workspace.yaml'), 'utf8')

    expect(workspace).toMatch(/^packages:\s*$/m)
    expect(workspace).toMatch(/^\s+-\s+"\."\s*$/m)
    expect(workspace).toContain('onlyBuiltDependencies:')
    expect(workspace).toContain('esbuild')
    expect(workspace).toContain('sharp')
  })

  it('uses pnpm 10 in the GitHub Pages deploy workflow', () => {
    const deployWorkflow = readFileSync(join(process.cwd(), '.github/workflows/deploy.yml'), 'utf8')

    expect(deployWorkflow).toContain('version: 10')
    expect(deployWorkflow).not.toMatch(/version:\s*9\b/)
  })
})
