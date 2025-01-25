import { Languages, Laptop, Smartphone } from 'lucide-react'

import { Badge } from './ui/badge'

interface BrowserInfoProps {
  browserInfo: Record<string, any>
}

const ICON_SIZE = 16

const platformIcon = (platform: string) => {
  return platform == 'mobile' ? (
    <Smartphone
      aria-details="Smartphone"
      className="inline-block fill-gray-600"
      width={ICON_SIZE}
      height={ICON_SIZE}
    />
  ) : (
    <Laptop className="inline-block stroke-gray-600" width={ICON_SIZE} height={ICON_SIZE} />
  )
}

export const BrowserInfo = ({ browserInfo }: BrowserInfoProps) => {
  return (
    <>
      {browserInfo.platform && (
        <Badge variant="secondary" className="flex space-x-1" title={browserInfo.platform}>
          {platformIcon(browserInfo.platform)}
        </Badge>
      )}
      {browserInfo.language && (
        <Badge variant="secondary" className="flex space-x-1">
          <Languages
            className="inline-block stroke-gray-600"
            width={ICON_SIZE}
            height={ICON_SIZE}
          />{' '}
          <span>{browserInfo.language}</span>
        </Badge>
      )}
      {browserInfo.os && (
        <Badge variant="secondary" className="flex space-x-1">
          {browserInfo.os} {browserInfo.osVersion}
        </Badge>
      )}
      {browserInfo.browserName && (
        <Badge variant="secondary" className="flex space-x-1">
          {browserInfo.browserName} {browserInfo.browserVersion}
        </Badge>
      )}
    </>
  )
}
