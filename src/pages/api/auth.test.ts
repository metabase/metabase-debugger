import { describe, it, expect } from 'vitest'

import { isAuthorized } from './auth'

describe('isAuthorized', () => {
  it('should return false if the authorization header is not correct', () => {
    expect(isAuthorized('wrong')).toBe(false)
  })

  it('should return true if the authorization header is correct', () => {
    expect(isAuthorized(process.env.AUTH_SECRET as string)).toBe(true)
  })
})
