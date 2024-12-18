import { GithubIcon } from 'lucide-react'

import { Button } from './ui/button'

interface CreateGithubIssueProps {
  diagnosticData: {
    url: string
    description?: string
    entityName: string
  }
  slackFileId?: string
}

export function CreateGithubIssue({ diagnosticData, slackFileId }: CreateGithubIssueProps) {
  const createGithubIssue = () => {
    const debuggerUrl = window.location.href
    const slackFileUrl = slackFileId
      ? `https://metaboat.slack.com/files/U02T6V8MXN2/${slackFileId}/diagnostic-info.json`
      : null

    const issueTitle = `[Bug Report] ${diagnosticData.entityName || 'Issue'} - ${
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
    <Button
      onClick={createGithubIssue}
      className="fixed top-4 right-4 z-50"
      variant="outline"
      size="sm"
    >
      <GithubIcon className="w-4 h-4 mr-2" />
      Create GitHub Issue
    </Button>
  )
}
