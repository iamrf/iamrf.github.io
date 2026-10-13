import { describe, it, expect } from 'vitest'
import { projects, PROJECT_LOCALES } from './projects'

const URL_RE = /^https?:\/\//i

function telegramUrls(project) {
  if (Array.isArray(project.telegram)) return project.telegram
  return project.telegram ? [project.telegram] : []
}

describe('projects data', () => {
  it('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it('has unique ids', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('exports the full locale set used by the site', () => {
    expect(PROJECT_LOCALES).toEqual(['en', 'fa', 'ar', 'ur', 'es', 'ru', 'zh', 'tr'])
  })

  it('each project has required fields, tags, and translations for every locale', () => {
    for (const project of projects) {
      expect(project.id).toEqual(expect.any(Number))
      expect(Array.isArray(project.tags)).toBe(true)
      expect(project.tags.length).toBeGreaterThan(0)
      expect(project.gradient).toMatch(/^from-/)

      for (const locale of PROJECT_LOCALES) {
        expect(project.title[locale], `${project.id} title.${locale}`).toBeTruthy()
        expect(typeof project.title[locale]).toBe('string')
        expect(project.description[locale], `${project.id} description.${locale}`).toBeTruthy()
        expect(typeof project.description[locale]).toBe('string')
        expect(project.title[locale].trim().length).toBeGreaterThan(0)
        expect(project.description[locale].trim().length).toBeGreaterThan(10)
      }

      expect(Object.keys(project.title).sort()).toEqual([...PROJECT_LOCALES].sort())
      expect(Object.keys(project.description).sort()).toEqual([...PROJECT_LOCALES].sort())
    }
  })

  it('live, github, and telegram links are valid https URLs when present', () => {
    for (const project of projects) {
      if (project.live) expect(project.live).toMatch(URL_RE)
      if (project.github) expect(project.github).toMatch(URL_RE)
      for (const href of telegramUrls(project)) {
        expect(href).toMatch(URL_RE)
        expect(href).toMatch(/t\.me\//)
        expect(href).not.toMatch(/t\.me\/@/)
      }
    }
  })

  it('lists Fandoq first, Qodo second, then PostFlow and Link to File', () => {
    expect(projects[0].title.en).toBe('Fandoq')
    expect(projects[1].title.en).toBe('Qodo')
    expect(projects[2].title.en).toBe('PostFlow')
    expect(projects[3].title.en).toBe('Link to File')
  })

  it('includes key portfolio apps', () => {
    const titles = projects.map((p) => p.title.en)
    expect(titles).toEqual(
      expect.arrayContaining([
        'Fandoq',
        'Qodo',
        'PostFlow',
        'Link to File',
        'GigUP',
        'Cheetah Marketplace',
        'NarenjWeb',
        'Narenj Uploader',
        'SurVPN',
        'FactorFA',
        'ChannelX',
        'ChannelUp',
      ]),
    )
  })

  it('PostFlow offers contact-for-demo and no public live URL', () => {
    const postflow = projects.find((p) => p.title.en === 'PostFlow')
    expect(postflow).toBeTruthy()
    expect(postflow.contactDemo).toBe(true)
    expect(postflow.live).toBeFalsy()
  })

  it('Link to File exposes both Telegram bots', () => {
    const linkToFile = projects.find((p) => p.title.en === 'Link to File')
    expect(linkToFile).toBeTruthy()
    expect(telegramUrls(linkToFile)).toEqual([
      'https://t.me/downloadtofile_bot',
      'https://t.me/LinkDrop_robot',
    ])
  })
})
