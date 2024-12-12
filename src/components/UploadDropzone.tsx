import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import { DiagnosticData } from '@/types/DiagnosticData'

interface UploadDropzoneProps {
  onFileUpload: (data: DiagnosticData) => void
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onFileUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      const reader = new FileReader()

      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const result = event.target?.result
          if (typeof result === 'string') {
            const parsedData = JSON.parse(result)

            const diagnosticData: DiagnosticData = {
              entityName: parsedData.entityName || '',
              bugReportDetails: parsedData.bugReportDetails || {},
              url: parsedData.url || '',
              entityInfo: {
                ...parsedData.entityInfo,
                bugReportDetails: parsedData.bugReportDetails,
              },
              frontendErrors: Array.isArray(parsedData.frontendErrors)
                ? parsedData.frontendErrors
                : [],
              backendErrors: Array.isArray(parsedData.backendErrors)
                ? parsedData.backendErrors
                : [],
              userLogs: Array.isArray(parsedData.userLogs) ? parsedData.userLogs : [],
              logs: Array.isArray(parsedData.logs) ? parsedData.logs : [],
              description: parsedData.description || 'No description provided',
              browserInfo: parsedData.browserInfo || {},
              queryResults: parsedData.queryResults || {},
            }

            onFileUpload(diagnosticData)
          }
        } catch (error) {
          console.error('Error parsing diagnostic info:', error)
          alert('Invalid file format. Please upload a valid Metabase diagnostic info file.')
        }
      }

      reader.readAsText(file)
    },
    [onFileUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
      data-testid="upload-dropzone"
    >
      <input {...getInputProps()} data-testid="upload-input" />
      {isDragActive ? (
        <p>Drop the Metabase diagnostic info file here...</p>
      ) : (
        <p>Drag and drop a Metabase diagnostic info file here, or click to select a file</p>
      )}
    </div>
  )
}

export { UploadDropzone }
