import { render } from '@testing-library/react'
import { ReactElement } from 'react'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <div className="light">{children}</div>
}

const customRender = (ui: ReactElement, options = {}) =>
  render(ui, {
    wrapper: Providers,
    ...options,
  })

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
// override render export
export { customRender as render }
