'use client'

import { useState, useMemo } from 'react'
import UploadDropzone from '@/components/UploadDropzone'
import DevToolsUI from '@/components/DevToolsUi'
import Image from 'next/image'

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [jsonData, setJsonData] = useState<{ rrwebEvents: any[], xhrEvents: any[], metadata?: Record<string, any>, logs?: any[], userLogs?: any[], backendErrors?: any[], basicInfo?: { currentUrl: string, id: number, name: string } } | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileId = searchParams.fileId as string | undefined

  const startTimestamp = useMemo(() => {
    if (jsonData && jsonData.rrwebEvents.length > 0) {
      return jsonData.rrwebEvents[0].timestamp;
    }
    return 0;
  }, [jsonData]);

  const handleFileUpload = (data: { rrwebEvents: any[], xhrEvents: any[], metadata: Record<string, any>, logs: any[], userLogs: any[], backendErrors: any[] }) => {
    if (data.rrwebEvents && data.xhrEvents && data.metadata) {
      setJsonData(data);
    } else {
      throw new Error('Invalid file structure: missing required data');
    }
  }

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  }

  useMemo(() => {
    if (fileId) {
      setIsLoading(true);
      setError(null);
      fetch(`/api/fetchSlackFile?fileId=${fileId}`)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            throw new Error(data.error);
          }
          if (data.rrwebEvents && data.xhrEvents && data.metadata) {
            setJsonData(data);
          } else {
            throw new Error('Invalid file structure: missing rrwebEvents, xhrEvents, or metadata');
          }
        })
        .catch(err => {
          console.error('Error fetching Slack file:', err);
          setError('Failed to fetch file from Slack. Please check the fileId and try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [fileId]);

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold flex items-center">
          <Image
            src="/metabase.webp"
            alt="Metabase Logo"
            width={150}
            height={40}
          />
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
      ) : !jsonData ? (
        <div className="flex-grow flex items-center justify-center">
          <UploadDropzone onFileUpload={handleFileUpload} />
        </div>
      ) : (
        <div className="flex-grow">
          <DevToolsUI jsonData={jsonData} currentTime={currentTime} onTimeUpdate={handleTimeUpdate} startTimestamp={startTimestamp} />
        </div>
      )}
    </main>
  )
}
