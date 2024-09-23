'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface FileLoaderProps {
  onFileLoad: (data: { rrwebEvents: any[], xhrEvents: any[] }) => void;
  onError: (error: string) => void;
  onLoading: (isLoading: boolean) => void;
}

export default function FileLoader({ onFileLoad, onError, onLoading }: FileLoaderProps) {
  const searchParams = useSearchParams()
  const fileId = searchParams?.get('fileId')

  useEffect(() => {
    if (fileId) {
      onLoading(true);
      onError('');
      fetch(`/api/fetchSlackFile?fileId=${fileId}`)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            throw new Error(data.error);
          }
          onFileLoad(data);
        })
        .catch(err => {
          console.error('Error fetching Slack file:', err);
          onError('Failed to fetch file from Slack. Please check the fileId and try again.');
        })
        .finally(() => {
          onLoading(false);
        });
    }
  }, [fileId, onFileLoad, onError, onLoading]);

  return null;
}
