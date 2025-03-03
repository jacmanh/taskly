import { TaskStatus } from '@prisma/client'
import bcrypt from 'bcrypt'
import { PrismaClient } from './prismaClient.js'

const prisma = new PrismaClient()

export async function seedDemoData() {
  try {
    const company = await prisma.company.create({
      data: {
        name: 'Company Demo',
      },
    })

    const companySlug = company.name.toLowerCase().replace(/ /g, '-')

    const saltRounds = parseInt(process.env.SALT || '10', 10)
    const hashedPassword = bcrypt.hashSync('password', saltRounds)

    const demoUser = await prisma.user.create({
      data: {
        email: `demo@${companySlug}.com`,
        password: hashedPassword,
        username: 'demo',
        companyId: company.id,
      },
    })

    await prisma.task.createMany({
      data: [
        {
          title: 'Complete project proposal',
          description: 'Draft the initial proposal for the client meeting',
          status: TaskStatus.todo,
          authorId: demoUser.id,
          companyId: company.id,
        },
        {
          title: 'Review pull requests',
          description: "Check and approve team's code changes",
          status: TaskStatus.in_progress,
          authorId: demoUser.id,
          companyId: company.id,
        },
      ],
    })

    return demoUser
  } catch (e) {
    console.error('Error seeding demo data:', e)
    throw e
  }
}

// If the script is run directly, seed the database
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDemoData()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
}
