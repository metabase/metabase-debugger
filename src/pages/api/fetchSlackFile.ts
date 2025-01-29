import { NextApiRequest, NextApiResponse } from 'next'

import { slackClient } from '@/utils/slackClient'

import { isAuthorized } from './auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  isAuthorized(req, res)

  const { fileId } = req.query
  if (!fileId || typeof fileId !== 'string') {
    return res.status(400).json({ error: 'Invalid fileId' })
  }

  try {
    const result = await slackClient.files.info({ file: fileId })

    if (!result.file || !result.file.url_private) {
      return res.status(404).json({ error: 'File not found' })
    }

    const fileContent = await fetch(result.file.url_private, {
      headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` },
    })

    const jsonData = await fileContent.json()
    res.status(200).json(jsonData)
  } catch (error) {
    console.error('Error fetching Slack file:', error)
    res.status(500).json({ error: 'Error fetching Slack file' })
  }
}
