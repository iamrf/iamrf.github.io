import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import SectionHeader from './SectionHeader'

describe('SectionHeader', () => {
  it('renders title and subtitle', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SectionHeader title="Projects" subtitle="What I've built" />
      </I18nextProvider>,
    )

    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByText("What I've built")).toBeInTheDocument()
  })
})
