'use client'

import Image from 'next/image'
import { useState, useMemo } from 'react'

import DevToolsUI from '@/components/DevToolsUi'
import UploadDropzone from '@/components/UploadDropzone'
import { DiagnosticData } from '@/types/DiagnosticData'

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileId = searchParams.fileId as string | undefined

  const handleFileUpload = (data: DiagnosticData) => {
    if (data.url && Array.isArray(data.frontendErrors) && Array.isArray(data.backendErrors)) {
      setDiagnosticData(data)
    } else {
      throw new Error('Invalid file structure: missing required data')
    }
  }

  useMemo(() => {
    if (fileId) {
      setIsLoading(true)
      setError(null)
      fetch(`/api/fetchSlackFile?fileId=${fileId}`)
        .then((response) => response.json())
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
          setError('Failed to fetch file from Slack. Please check the fileId and try again.')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [fileId])

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex justify-between items-center p-4">
        <h1
          className="text-xl font-semibold flex items-center cursor-pointer"
          onClick={() => (window.location.href = '/')}
        >
          <Image src="/metabase.webp" alt="Metabase Logo" width={150} height={40} />
          Debugger
        </h1>
      </div>
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <p>Loading file from Slack...</p>
        </div>
      ) : error ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : !diagnosticData ? (
        <div className="flex-grow flex items-center justify-center">
          <UploadDropzone onFileUpload={handleFileUpload} />
        </div>
      ) : (
        <div className="flex-grow">
          <DevToolsUI diagnosticData={diagnosticData} />
        </div>
      )}
    </main>
  )
}
