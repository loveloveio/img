import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/db';
import { z } from 'zod';
import { auth } from '@/libs/better-auth';
import { randomUUID } from 'crypto';
const querySchema = z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('10'),
    name: z.string().optional(),
    email: z.string().optional(),
    emailVerified: z.string().transform((v) => v === 'true').optional(),
    username: z.string().optional(),
    role: z.string().optional(),
    banned: z.string().transform((v) => v === 'true').optional(),
});

export async function GET(req: NextRequest) {
    try {
        const searchParams = Object.fromEntries(req.nextUrl.searchParams);
        const { page, limit, name, email, emailVerified, username, role, banned } = await querySchema.parseAsync(searchParams);
        const where: any = {};

        if (name) {
            where.name = {
                contains: name
            };
        }
        if (email) {
            where.email = {
                contains: email
            };
        }
        if (emailVerified !== undefined) {
            where.emailVerified = emailVerified;
        }
        if (username) {
            where.username = {
                contains: username
            };
        }
        if (role) {
            where.role = role;
        }
        console.log('banned', banned);
        if (banned !== undefined) {
            where.banned = banned;
        }

        // Get total count
        const total = await prisma.user.count({ where });

        // Get paginated users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                role: true,
                banned: true,
                banReason: true,
                banExpires: true,
                username: true,
                vipExpiredAt: true
            },
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
        });

        return NextResponse.json({
            code: 200,
            message: 'success',
            data: {
                list: users,
                total
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                code: 400,
                message: error.errors[0]?.message
            }, { status: 400 });
        }

        return NextResponse.json({
            code: 500,
            message: '服务器错误'
        }, { status: 500 });
    }
}

const createSchema = z.object({
    name: z.string().min(1, '请输入姓名'),
    username: z.string().min(1, '请输入用户名'),
    email: z.string().email('请输入有效的邮箱'),
    password: z.string()
        .min(8, '密码长度不能小于8位')
        .max(32, '密码长度不能大于32位')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/, '密码必须包含大小写字母和数字'),
    emailVerified: z.boolean().default(false),
    role: z.enum(['user', 'admin']).default('user'),
    banned: z.boolean().default(false),
    banReason: z.string().optional(),
    banExpires: z.string().datetime().optional(),
    vipExpiredAt: z.string().datetime().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = await createSchema.parseAsync(body);
        const ctx = await auth.$context;
        const user = await ctx.internalAdapter.createUser({
            name: data.name,
            username: data.username,
            email: data.email,
            emailVerified: data.emailVerified,
            image: `https://robohash.org/${randomUUID()}`,
            role: data.role,
            banned: data.banned,
            banReason: data.banReason,
            banExpires: data.banExpires,
            vipExpiredAt: data.vipExpiredAt,
        });
        const hash = await ctx.password.hash(data.password);
        await ctx.internalAdapter.linkAccount({
            userId: user.id,
            providerId: "credential",
            accountId: user.id,
            password: hash,
        });
        return NextResponse.json({
            code: 200,
            message: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            code: 500,
            message: '服务器错误'
        }, { status: 500 });
    }
}
