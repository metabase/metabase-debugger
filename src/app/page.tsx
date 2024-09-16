'use client'

import { useState, useMemo } from 'react'
import UploadDropzone from '@/components/UploadDropzone'
import DevToolsUI from '@/components/DevToolsUi'
import Image from 'next/image'

export default function Home() {
  const [jsonData, setJsonData] = useState<{ rrwebEvents: any[], xhrEvents: any[] } | null>(null)
  const [currentTime, setCurrentTime] = useState(0)

  const startTimestamp = useMemo(() => {
    if (jsonData && jsonData.rrwebEvents.length > 0) {
      return jsonData.rrwebEvents[0].timestamp;
    }
    return 0;
  }, [jsonData]);

  const handleFileUpload = (data: { rrwebEvents: any[], xhrEvents: any[] }) => {
    setJsonData(data)
  }

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  }

  return (
    <main className="min-h-screen flex flex-col">
      <h1 className="text-xl font-semibold flex items-center">
        <Image
          src="/metabase.webp"
          alt="Metabase Logo"
          width={150}
          height={40}
        />
        Debugger
      </h1>
      {!jsonData ? (
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