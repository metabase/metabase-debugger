'use client'

import { useState, useMemo } from 'react'

import { DevToolsUI } from '@/components/DevToolsUi'
import { FetchError } from '@/components/FetchError'
import { UploadDropzone } from '@/components/UploadDropzone'
import { DiagnosticData } from '@/types/DiagnosticData'

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)

  const fileId = searchParams.fileId as string | undefined

  const handleFileUpload = (data: DiagnosticData) => {
    if (data.url && Array.isArray(data.frontendErrors) && Array.isArray(data.backendErrors)) {
      setDiagnosticData(data)
    } else {
      throw new Error('Invalid file structure: missing required data')
    }
  }

  useMemo(() => {
    // local storage won't work in SSR
    const token = typeof localStorage !== 'undefined' && localStorage.getItem('debugger-token')
    if (fileId) {
      setIsLoading(true)
      setError(null)
      fetch(`/api/fetchSlackFile?fileId=${fileId}`, {
        headers: {
          authorization: token,
        } as any,
      })
        .then((response) => {
          setResponseStatus(response.status)
          return response.json()
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error)
          }
          if (data.url && Array.isArray(data.frontendErrors) && Array.isArray(data.backendErrors)) {
            setDiagnosticData(data)
          } else {
            throw new Error('Invalid file structure: missing required diagnostic data')
          }
        })
        .catch((err) => {
          console.error('Error fetching Slack file:', err)
          setError('Failed to fetch file from Slack. ' + err?.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [fileId])

  return (
    <main className="min-h-screen flex flex-col">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <p>Loading file from Slack...</p>
        </div>
      ) : !diagnosticData ? (
        <div className="flex-grow flex flex-col items-center justify-center">
          <FetchError error={error} statusCode={responseStatus} />
          <UploadDropzone onFileUpload={handleFileUpload} />
        </div>
      ) : (
        <div className="flex-grow">
          <DevToolsUI diagnosticData={diagnosticData} slackFileId={fileId} />
        </div>
      )}
    </main>
  )
}
