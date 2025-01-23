import { createRequire } from 'module'
import type { PrismaClient as ImportedPrismaClient } from '@prisma/client'

const require = createRequire(import.meta.url ?? __filename)

const { PrismaClient: RequiredPrismaClient } = require('@prisma/client')

const _PrismaClient: typeof ImportedPrismaClient = RequiredPrismaClient

export class PrismaClient extends _PrismaClient {}
