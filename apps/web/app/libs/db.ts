import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import {getPhotoCollectionIndex} from './meilisearch'

const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
}).$extends({
  query: {
    photoCollection: {
        create: async ({args, query}) => {
            const result = await query(args)
            const index = await getPhotoCollectionIndex();
            await index?.addDocuments([{
                id: Number(result.id),
                uuid: result.uuid ?? '',
                title: result.title ?? '',
                cover: result.cover ?? '',
                subtitle: result.subtitle ?? '',
                tags: result.tags ?? [],
                imageCount: result.imageCount,
                description: result.description ?? '',
                recommend: result.recommend,
                status: result.status,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
                _geo: {
                    lat: Math.random() * 180 - 90,
                    lng: Math.random() * 360 - 180
                },
            }])
            return result
        },
        update: async ({args, query}) => {
            const result = await query(args)
            const index = await getPhotoCollectionIndex();
            await index?.updateDocuments([{
                id: Number(result.id),
                uuid: result.uuid ?? '',
                title: result.title ?? '',
                subtitle: result.subtitle ?? '',
                tags: result.tags ?? [],
                description: result.description ?? '',
                cover: result.cover ?? '',
                recommend: result.recommend,
                imageCount: result.imageCount,
                status: result.status,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
            }])
            return result
        },
        delete: async ({args, query}) => {
            const result = await query(args)
            if (result?.id) {
              const index = await getPhotoCollectionIndex();
              await index?.deleteDocuments([Number(result.id)])
            }
            return result
        }
    }
  }
})
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma