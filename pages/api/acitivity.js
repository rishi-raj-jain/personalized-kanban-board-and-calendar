import { cors, runMiddleware } from '@/lib/cors'
import redis, { invalidMethodError, okResponseBody } from '@/lib/redis'

const acitivity = async (req, res) => {
  await runMiddleware(req, res, cors)
  try {
    if (req.method === 'GET') {
      const { createdAt, userEmail } = req.query
      if (createdAt) {
        let Card = JSON.parse(await redis.hget('cards', createdAt))
        if (Card && Object.keys(Card).length < 1) {
          res.status(400).json({ message: 'No such card found.' })
          return
        }
        res.status(200).json({ Card })
        return
      } else {
        let Cards = []
        let tempCards = await redis.hvals('cards')
        tempCards.forEach((i) => {
          let temp = JSON.parse(i)
          if (temp && userEmail && userEmail.length > 0 && userEmail.includes('@') && temp.createdAt && temp.createdAt.includes(userEmail)) {
            Cards.push(temp)
          }
        })
        if (Cards.length < 1) {
          res.status(200).json({ message: 'No cards found.' })
          return
        }
        res.status(200).json({ Cards })
        return
      }
    } else if (req.method === 'POST') {
      const cardObj = {
        ...req.body,
        createdAt: `${Date.now()}:${req.body.userEmail}`,
      }
      await redis.hset('cards', cardObj.createdAt, JSON.stringify(cardObj))
      res.status(200).json(okResponseBody)
      return
    } else if (req.method === 'PUT') {
      if (req.body.createdAt) {
        let oldObj = JSON.parse(await redis.hget('cards', req.body.createdAt))
        await redis.hset('cards', req.body.createdAt, JSON.stringify({ ...oldObj, ...req.body }))
        res.status(200).json(okResponseBody)
      } else {
        const cardObj = {
          ...req.body,
          createdAt: Date.now(),
        }
        await redis.hset('cards', cardObj.createdAt, JSON.stringify(cardObj))
        res.status(200).json(okResponseBody)
      }
      return
    } else if (req.method === 'DELETE') {
      await redis.hdel('cards', req.body.createdAt)
      res.status(200).json(okResponseBody)
      return
    } else {
      res.status(400).json(invalidMethodError)
      return
    }
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: e })
    return
  }
}

export default acitivity
