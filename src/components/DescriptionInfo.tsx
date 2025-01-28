import { Link } from 'lucide-react'

import { DiagnosticData } from '@/types/DiagnosticData'

import { Badge } from './ui/badge'

interface DescriptionInfoProps {
  diagnosticData: Pick<DiagnosticData, 'url' | 'description'>
}

const truncateUrl = (url: string) => {
  return url.length > 100 ? `${url.substring(0, 90)}...${url.substring(url.length - 7)}` : url
}

export const DescriptionInfo = ({ diagnosticData }: DescriptionInfoProps) => {
  return (
    <div className="px-4">
      {diagnosticData.url && (
        <Badge variant="secondary" className="text-xs mb-3">
          <span className="inline-block pr-2">Occurred at: </span>
          <a href={diagnosticData.url} target="_blank" title={diagnosticData.url}>
            <Link width={12} height={12} className="inline-block" />{' '}
            {truncateUrl(diagnosticData.url)}
          </a>
        </Badge>
      )}
      <div className="border-l-4 border-sky-600 p-2 font-mono text-xs ml-1 max-h-32 overflow-y-auto">
        <pre>
          {diagnosticData.description || <em>No description provided</em>}
        </pre>
      </div>
    </div>
  )
}
