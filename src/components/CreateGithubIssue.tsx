import { GithubIcon } from 'lucide-react'

import type { DiagnosticData } from '@/types/DiagnosticData'

import { Button } from './ui/button'
interface CreateGithubIssueProps {
  diagnosticData: Pick<DiagnosticData, 'url' | 'description' | 'entityInfo'>
  slackFileId?: string
}

export function CreateGithubIssue({ diagnosticData, slackFileId }: CreateGithubIssueProps) {
  const createGithubIssue = () => {
    const debuggerUrl = window.location.href
    const slackFileUrl = slackFileId
      ? `https://metaboat.slack.com/files/U02T6V8MXN2/${slackFileId}/diagnostic-info.json`
      : null

    const issueTitle = `[Bug Report] ${diagnosticData.entityInfo.entityName || 'Issue'} - ${
      diagnosticData.url || 'No URL'
    }`

    const issueBody = `
### Description
${diagnosticData.description || 'No description provided'}

### Links
- Original URL: ${diagnosticData.url || 'N/A'}
${slackFileUrl ? `- Slack File: ${slackFileUrl}` : ''}
- Bug Report Debugger: ${debuggerUrl}
`

    const githubUrl = new URL('https://github.com/metabase/metabase/issues/new')
    githubUrl.searchParams.set('title', issueTitle)
    githubUrl.searchParams.set('body', issueBody)
    githubUrl.searchParams.set('labels', 'Bug')

    window.open(githubUrl.toString(), '_blank')
  }

  return (
    <Button onClick={createGithubIssue} variant="default" size="sm">
      <GithubIcon className="w-4 h-4 mr-2" />
      Create GitHub Issue
    </Button>
  )
}
