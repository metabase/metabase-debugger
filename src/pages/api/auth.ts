export const isAuthorized = (authorizationHeader?: string | null) => {
  return authorizationHeader === process.env.AUTH_SECRET
}
