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
