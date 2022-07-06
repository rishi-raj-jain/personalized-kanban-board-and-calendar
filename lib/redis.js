import Redis from 'ioredis'

const redis = process.env.NODE_ENV === 'production' ? new Redis(process.env.REDIS_URL) : new Redis(JSON.parse(process.env.REDIS_URL_DEV))

export default redis

export const invalidMethodError = {
  code: 0,
  message: 'Not acceptable method.',
}

export const okResponseBody = {
  code: 1,
}

export const errorResponseError = {
  code: 2,
  message: 'Error response body.',
}

export const noCaseBody = {
  code: 3,
  message: 'No given case passed.',
}

export const verifyUserAsAdmin = async (userEmail) => {
  if (!userEmail || userEmail.length < 1) return false
  return (await redis.hget('auth_lists', userEmail)) === 'admin'
}
