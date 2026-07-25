import { describe, it, expect } from 'vitest'
import { experiences } from './experience'

describe('experience data', () => {
  it('has at least one experience entry', () => {
    expect(experiences.length).toBeGreaterThan(0)
  })

  it('each entry has bilingual role, company, period, and description', () => {
    for (const exp of experiences) {
      expect(exp.period.en).toBeTruthy()
      expect(exp.period.fa).toBeTruthy()
      expect(exp.role.en).toBeTruthy()
      expect(exp.role.fa).toBeTruthy()
      expect(exp.company.en).toBeTruthy()
      expect(exp.company.fa).toBeTruthy()
      expect(exp.description.en).toBeTruthy()
      expect(exp.description.fa).toBeTruthy()
      expect(Array.isArray(exp.tags)).toBe(true)
      expect(exp.tags.length).toBeGreaterThan(0)
    }
  })
})
