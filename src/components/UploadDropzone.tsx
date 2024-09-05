import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadDropzoneProps {
  onFileUpload: (data: any) => void
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
  
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target?.result as string)
        if (parsedData.rrwebEvents && Array.isArray(parsedData.rrwebEvents) &&
            parsedData.xhrEvents && Array.isArray(parsedData.xhrEvents)) {
          onFileUpload({
            rrwebEvents: parsedData.rrwebEvents,
            xhrEvents: parsedData.xhrEvents
          })
        } else {
          throw new Error('Invalid JSON structure: missing or invalid rrwebEvents or xhrEvents')
        }
      } catch (error) {
        console.error('Error parsing JSON:', error)
        alert('Invalid JSON file. Please upload a valid JSON file with rrwebEvents and xhrEvents.')
      }
    }
  
    reader.readAsText(file)
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/json': ['.json'] } })

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the JSON file here...</p>
      ) : (
        <p>Drag and drop a JSON file here, or click to select a file</p>
      )}
    </div>
  )
}

export default UploadDropzone