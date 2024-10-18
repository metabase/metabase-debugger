import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadDropzoneProps {
  onFileUpload: (data: { rrwebEvents: any[]; xhrEvents: any[]; metadata: Record<string, any>; logs: any[]; userLogs: any[]; backendErrors: any[], basicInfo: { currentUrl: string, id: number, name: string } }) => void;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
  
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const parsedData = JSON.parse(result);
          if (parsedData.rrwebEvents && Array.isArray(parsedData.rrwebEvents) &&
              parsedData.xhrEvents && Array.isArray(parsedData.xhrEvents) &&
              parsedData.metadata && typeof parsedData.metadata === 'object') {
            onFileUpload({
              rrwebEvents: parsedData.rrwebEvents,
              xhrEvents: parsedData.xhrEvents,
              metadata: parsedData.metadata,
              logs: parsedData.logs || [],
              userLogs: parsedData.userLogs || [],
              backendErrors: parsedData.backendErrors || [],
              basicInfo: parsedData.basicInfo || {}
            });
          } else {
            throw new Error('Invalid JSON structure: missing or invalid required data');
          }
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Invalid JSON file. Please upload a valid JSON file with rrwebEvents, xhrEvents, and metadata.');
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
