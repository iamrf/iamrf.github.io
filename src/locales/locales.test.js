import { describe, it, expect } from 'vitest'
import en from '../locales/en.json'
import fa from '../locales/fa.json'
import ar from '../locales/ar.json'
import ur from '../locales/ur.json'
import es from '../locales/es.json'
import ru from '../locales/ru.json'
import zh from '../locales/zh.json'
import tr from '../locales/tr.json'

const locales = { en, fa, ar, ur, es, ru, zh, tr }

function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value, path)
    }
    return [path]
  })
}

describe('locale catalogs', () => {
  const enKeys = flattenKeys(en).sort()

  it('english has core navigation and project keys', () => {
    expect(en.nav.projects).toBeTruthy()
    expect(en.projects.telegram).toBeTruthy()
    expect(en.projects.demo).toBeTruthy()
    expect(en.hero.name).toBe('Aref Fallah')
  })

  it.each(Object.keys(locales))('%s matches english key structure', (lang) => {
    const keys = flattenKeys(locales[lang]).sort()
    expect(keys).toEqual(enKeys)
  })
})
