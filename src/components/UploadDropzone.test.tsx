import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { UploadDropzone } from './UploadDropzone'
import { render, screen } from '../test/test-utils'

describe('UploadDropzone', () => {
  const mockOnFileUpload = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => render(<UploadDropzone onFileUpload={mockOnFileUpload} />)).not.toThrow()
  })

  it('displays correct text for drag and drop', () => {
    render(<UploadDropzone onFileUpload={mockOnFileUpload} />)
    expect(
      screen.getByText(/Drag and drop a Metabase diagnostic info file here/)
    ).toBeInTheDocument()
  })

  it('handles file upload correctly', async () => {
    const user = userEvent.setup()

    const fileContent = {
      url: 'https://test.com',
      description: 'Test description',
      entityInfo: {},
      browserInfo: { browserName: 'Chrome' },
      frontendErrors: [],
      backendErrors: [],
      userLogs: [],
      logs: [],
    }

    const file = new File([JSON.stringify(fileContent)], 'test.json', { type: 'application/json' })

    render(<UploadDropzone onFileUpload={mockOnFileUpload} />)

    const input = screen.getByTestId('upload-input')
    await user.upload(input, file)

    expect(mockOnFileUpload).toHaveBeenCalledTimes(1)
    expect(mockOnFileUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://test.com',
        description: 'Test description',
      })
    )
  })

  it('handles invalid JSON file', async () => {
    const user = userEvent.setup()

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    const invalidFile = new File(['invalid json'], 'test.json', { type: 'application/json' })
    render(<UploadDropzone onFileUpload={mockOnFileUpload} />)

    const input = screen.getByTestId('upload-input')
    await user.upload(input, invalidFile)

    expect(consoleSpy).toHaveBeenCalled()
    expect(alertMock).toHaveBeenCalledWith(
      'Invalid file format. Please upload a valid Metabase diagnostic info file.'
    )
    expect(mockOnFileUpload).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
    alertMock.mockRestore()
  })
})
