import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HelloWorld } from './HelloWorld'
import { useHello } from './useHello'

vi.mock('./useHello')

const mockedUseHello = vi.mocked(useHello)

describe('HelloWorld', () => {
  beforeEach(() => {
    mockedUseHello.mockReset()
  })

  it('shows a loading message while the request is pending', () => {
    mockedUseHello.mockReturnValue({ isPending: true } as ReturnType<
      typeof useHello
    >)

    render(<HelloWorld />)

    expect(screen.getByText('Backend wird geladen...')).toBeInTheDocument()
  })

  it('shows the backend response after a successful request', () => {
    mockedUseHello.mockReturnValue({
      isPending: false,
      isError: false,
      data: { message: 'Hallo vom Backend' },
    } as ReturnType<typeof useHello>)

    render(<HelloWorld />)

    expect(screen.getByRole('alert')).toHaveTextContent('Hallo vom Backend')
  })

  it('shows an error message after a failed request', () => {
    mockedUseHello.mockReturnValue({
      isPending: false,
      isError: true,
      error: new Error('Nicht erreichbar'),
    } as ReturnType<typeof useHello>)

    render(<HelloWorld />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Fehler: Nicht erreichbar',
    )
  })
})
