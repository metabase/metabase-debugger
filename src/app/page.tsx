'use client'

import { useState, useMemo } from 'react'
import UploadDropzone from '@/components/UploadDropzone'
import RRWebPlayer from '@/components/RRWebPlayer'
import XHREventsTable from '@/components/XHREventsTable'

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
    console.log('time', time)
    setCurrentTime(time);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Replayed session</h1>
      {!jsonData ? (
        <UploadDropzone onFileUpload={handleFileUpload} />
      ) : (
        <div className="flex gap-4">
          <RRWebPlayer jsonData={jsonData} onTimeUpdate={handleTimeUpdate} />
          <XHREventsTable
            xhrEvents={jsonData.xhrEvents}
            currentTime={currentTime}
            startTimestamp={startTimestamp}
          />
        </div>
      )}
    </main>
  )
}