import { describe, it, expect } from 'vitest'

import { FetchError } from './FetchError'
import { render, screen, userEvent, waitFor } from '../test/test-utils'

describe('FetchError', () => {

  it("renders fetch error", () => {
    render(<FetchError error="oops" statusCode={418} />)
    expect(screen.getByText("oops")).toBeInTheDocument();
    expect(screen.queryByText("Set auth token")).not.toBeInTheDocument();
  });

  it("renders fetch error with auth button", () => {
    render(<FetchError error="Unauthorized" statusCode={403}/>)
    expect(screen.getByText("Unauthorized")).toBeInTheDocument();
    expect(screen.getByText("Set auth token")).toBeInTheDocument();
  });

  it("opens auth modal", async () => {
    render(<FetchError error="Unauthorized" statusCode={401} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    screen.getByText("Set auth token")
    userEvent.click(screen.getByText("Set auth token"))
    expect(await screen.findByText("Enter your auth token")).toBeInTheDocument();
  })

  it("saves auth token", async () => {
    render(<FetchError error="Unauthorized" statusCode={403} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    userEvent.click(screen.getByText("Set auth token"))
    expect(await screen.findByText("Enter your auth token")).toBeInTheDocument();

    userEvent.click(screen.getByPlaceholderText("Auth token"))
    userEvent.paste("abc123")

    userEvent.click(screen.getByText("Save"))

    waitFor(() => {
      expect(localStorage.getItem('debugger-token')).toBe("abc123")
    })
  })
})
