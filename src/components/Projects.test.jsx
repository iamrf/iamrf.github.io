import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import Projects from './Projects'

function renderProjects() {
  return render(
    <I18nextProvider i18n={i18n}>
      <Projects />
    </I18nextProvider>,
  )
}

describe('Projects', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders the projects section and featured apps', () => {
    renderProjects()

    expect(document.getElementById('projects')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByText('GigUP')).toBeInTheDocument()
    expect(screen.getByText('FactorFA')).toBeInTheDocument()
    expect(screen.getByText('ChannelX')).toBeInTheDocument()
    expect(screen.getByText('Narenj Uploader')).toBeInTheDocument()
  })

  it('exposes live and telegram links for GigUP', () => {
    renderProjects()

    const card = screen.getByText('GigUP').closest('article')
    expect(card).toBeTruthy()

    const links = within(card).getAllByRole('link')
    const hrefs = links.map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('https://gigup-rho.vercel.app')
    expect(hrefs).toContain('https://t.me/gigup1bot')
  })

  it('exposes github and telegram links for ChannelX', () => {
    renderProjects()

    const card = screen.getByText('ChannelX').closest('article')
    const hrefs = within(card)
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))

    expect(hrefs).toContain('https://github.com/iamrf/channelx')
    expect(hrefs).toContain('https://t.me/channel2x_bot')
  })
})
