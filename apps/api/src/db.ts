import { PrismaClient } from './prismaClient.js'

const db = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
})

export default db
