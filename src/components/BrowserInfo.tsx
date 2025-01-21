import { Compass, Grid, Languages, Laptop, Smartphone } from 'lucide-react'

import { Badge } from './ui/badge'
import Apple from '../../public/apple.svg'
import Firefox from '../../public/firefox.svg'
import Chrome from '../../public/googlechrome.svg'
import Linux from '../../public/linux.svg'
import Safari from '../../public/safari.svg'

interface BrowserInfoProps {
  browserInfo: Record<string, any>
}

const ICON_SIZE = 16
const iconClass = (prefix: 'stroke' | 'fill') => `inline-block ${prefix}-gray-600`

const browserIcon = (browser: string) => {
  switch (browser) {
    case 'Chrome':
      return <Chrome className={iconClass('fill')} width={ICON_SIZE} height={ICON_SIZE} />
    case 'Safari':
      return <Safari className={iconClass('fill')} width={ICON_SIZE} height={ICON_SIZE} />
    case 'Firefox':
      return <Firefox className={iconClass('fill')} width={ICON_SIZE} height={ICON_SIZE} />
  }
  return <Compass className={iconClass('stroke')} width={ICON_SIZE} height={ICON_SIZE} />
}

const osIcon = (os: string) => {
  switch (os) {
    case 'macOS':
      return <Apple className={iconClass('fill')} width={ICON_SIZE} height={ICON_SIZE} />
    case 'Linux':
      return <Linux className={iconClass('fill')} width={ICON_SIZE} height={ICON_SIZE} />
  }
  return <Grid className={iconClass('stroke')} width={ICON_SIZE} height={ICON_SIZE} />
}

const platformIcon = (platform: string) => {
  return platform == 'mobile' ? (
    <Smartphone
      aria-details="Smartphone"
      className={iconClass('fill')}
      width={ICON_SIZE}
      height={ICON_SIZE}
    />
  ) : (
    <Laptop className={iconClass('stroke')} width={ICON_SIZE} height={ICON_SIZE} />
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
          <Languages className={iconClass('stroke')} width={ICON_SIZE} height={ICON_SIZE} />{' '}
          <span>{browserInfo.language}</span>
        </Badge>
      )}
      {browserInfo.os && (
        <Badge variant="secondary" className="flex space-x-1">
          {osIcon(browserInfo.os)}{' '}
          <span>
            {browserInfo.os} {browserInfo.osVersion}
          </span>
        </Badge>
      )}
      {browserInfo.browserName && (
        <Badge variant="secondary" className="flex space-x-1">
          {browserIcon(browserInfo.browserName)}{' '}
          <span>
            {browserInfo.browserName} {browserInfo.browserVersion}
          </span>
        </Badge>
      )}
    </>
  )
}
