import Cors from 'cors'

export const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})

export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}
