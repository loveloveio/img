import { betterAuth } from "better-auth"
import { admin, username } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/libs/db";
import { redis } from "@/libs/redis";

export const auth = betterAuth({
    user: {
        additionalFields: {
            vipExpiredAt: {
                type: 'date',
                required: false,
                input: false,
            }
        }
    },
    emailAndPassword: {
        enabled: true,
    },
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    plugins: [
        admin(),
        username()
    ],
    secondaryStorage: {
        get: async (key) => {
            const value = await redis.get(key);
            return value ? value : null;
        },
        set: async (key, value, ttl) => {
            if (ttl) {
                await redis.set(key, value, 'EX', ttl)
            } else {
                await redis.set(key, value);
            }
        },
        delete: async (key) => {
            await redis.del(key);
        }
    }
})