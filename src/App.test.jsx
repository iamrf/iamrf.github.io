import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import App from './App'

describe('App', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    document.documentElement.removeAttribute('dir')
    document.documentElement.removeAttribute('lang')
  })

  it('renders main landmark and hero name', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>,
    )

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText('Aref Fallah')).toBeInTheDocument()
  })

  it('sets document dir to rtl for Persian', async () => {
    await i18n.changeLanguage('fa')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>,
    )

    expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    expect(document.documentElement.getAttribute('lang')).toBe('fa')
  })
})
