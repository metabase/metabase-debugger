import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

export const isAuthorized = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.headers.authorization !== process.env.AUTH_SECRET) {
    console.log('Unauthorized')
    return res.status(403).json({ error: 'Unauthorized' })
  }
  NextResponse.next()
}
