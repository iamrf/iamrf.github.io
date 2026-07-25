import { describe, it, expect } from 'vitest'
import { skills } from './skills'

describe('skills data', () => {
  it('has frontend, backend, and tools categories', () => {
    expect(skills.map((s) => s.id)).toEqual(
      expect.arrayContaining(['frontend', 'backend', 'tools']),
    )
  })

  it('each category has a title key and non-empty items', () => {
    for (const category of skills) {
      expect(category.titleKey).toMatch(/^skills\.categories\./)
      expect(category.items.length).toBeGreaterThan(0)
      for (const item of category.items) {
        expect(item.name).toBeTruthy()
        expect(item.color).toMatch(/^#/)
      }
    }
  })
})
