import { WebAPICallResult } from '@slack/web-api'
import { NextApiRequest, NextApiResponse } from 'next'
import { vi, describe, it, expect, beforeEach } from 'vitest'

import { slackClient } from '@/utils/slackClient'

import handler from './fetchSlackFile'

interface SlackFileInfoResponse extends WebAPICallResult {
  file?:
    | {
        url_private: string
        [key: string]: unknown
      }
    | undefined
}

// Mock the slackClient
vi.mock('@/utils/slackClient', () => ({
  slackClient: {
    files: {
      info: vi.fn(),
    },
  },
}))

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('fetchSlackFile API', () => {
  let mockReq: Partial<NextApiRequest>
  let mockRes: Partial<NextApiResponse>

  beforeEach(() => {
    mockReq = {
      query: {},
      headers: {
        authorization: process.env.AUTH_SECRET,
      }
    }
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    vi.clearAllMocks()
  })

  it('returns 400 if fileId is missing', async () => {
    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse)

    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid fileId' })
  })

  it('returns 400 if fileId is not a string', async () => {
    mockReq.query = { fileId: ['multiple', 'values'] }

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse)

    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid fileId' })
  })

  it('returns 404 if file is not found', async () => {
    mockReq.query = { fileId: 'nonexistent' }
    const mockResponse: SlackFileInfoResponse = {
      ok: true,
      file: undefined,
    }
    vi.mocked(slackClient.files.info).mockResolvedValueOnce(mockResponse)

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse)

    expect(mockRes.status).toHaveBeenCalledWith(404)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'File not found' })
  })

  it('returns 500 if slack API throws error', async () => {
    mockReq.query = { fileId: 'error' }
    vi.mocked(slackClient.files.info).mockRejectedValueOnce(new Error('Slack API error'))

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse)

    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Error fetching Slack file' })
  })

  it('successfully fetches and returns file content', async () => {
    mockReq.query = { fileId: 'valid' }
    const mockFileContent = { key: 'value' }

    const mockResponse: SlackFileInfoResponse = {
      ok: true,
      file: {
        url_private: 'https://slack.com/file',
        id: 'valid',
        name: 'test.json',
      },
    }
    vi.mocked(slackClient.files.info).mockResolvedValueOnce(mockResponse)

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockFileContent),
    })

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse)

    expect(mockFetch).toHaveBeenCalledWith('https://slack.com/file', {
      headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` },
    })
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith(mockFileContent)
  })
})
