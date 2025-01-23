import db from '@api/db.js'
import { Prisma } from '@prisma/client'

export const getUserById = async (id: string, companyId: string) => {
  const user = db.user.findUnique({
    where: {
      id,
      companyId,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export const createUser = async (data: Prisma.UserCreateInput) => {
  try {
    return db.user.create({
      data,
    })
  } catch (error) {
    throw error
  }
}
