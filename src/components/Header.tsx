import Image from 'next/image'

import { DiagnosticData } from '@/types/DiagnosticData'

import { BrowserInfo } from './BrowserInfo'
import { CreateGithubIssue } from './CreateGithubIssue'

interface HeaderProps {
  diagnosticData: DiagnosticData
  slackFileId: string | undefined
}

export const Header = ({ diagnosticData, slackFileId }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center p-4">
      <h1
        className="text-s font-semibold flex items-center cursor-pointer"
        onClick={() => (window.location.href = '/')}
      >
        <Image src="/metabase.svg" alt="Logo" width={20} height={25} className="mr-2" />
        Metabase Debugger
      </h1>
      <div className="flex space-x-2">
        {diagnosticData.browserInfo && <BrowserInfo browserInfo={diagnosticData.browserInfo} />}
        <CreateGithubIssue diagnosticData={diagnosticData} slackFileId={slackFileId} />
      </div>
    </div>
  )
}
