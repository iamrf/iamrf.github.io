import { describe, it, expect } from 'vitest'
import { projects } from './projects'

const URL_RE = /^https?:\/\//i

describe('projects data', () => {
  it('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it('has unique ids', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('each project has required bilingual fields and tags', () => {
    for (const project of projects) {
      expect(project.id).toEqual(expect.any(Number))
      expect(project.title.en).toBeTruthy()
      expect(project.title.fa).toBeTruthy()
      expect(project.description.en).toBeTruthy()
      expect(project.description.fa).toBeTruthy()
      expect(Array.isArray(project.tags)).toBe(true)
      expect(project.tags.length).toBeGreaterThan(0)
      expect(project.gradient).toMatch(/^from-/)
    }
  })

  it('live, github, and telegram links are valid https URLs when present', () => {
    for (const project of projects) {
      if (project.live) expect(project.live).toMatch(URL_RE)
      if (project.github) expect(project.github).toMatch(URL_RE)
      if (project.telegram) {
        expect(project.telegram).toMatch(URL_RE)
        expect(project.telegram).toMatch(/t\.me\//)
      }
    }
  })

  it('lists Fandoq first', () => {
    expect(projects[0].title.en).toBe('Fandoq')
  })

  it('includes key portfolio apps', () => {
    const titles = projects.map((p) => p.title.en)
    expect(titles).toEqual(
      expect.arrayContaining([
        'Fandoq',
        'GigUP',
        'Cheetah Marketplace',
        'NarenjWeb',
        'Narenj Uploader',
        'SurVPN',
        'FactorFA',
        'ChannelX',
      ]),
    )
  })
})
