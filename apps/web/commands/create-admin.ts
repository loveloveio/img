import { Command } from "commander";
import { prompt } from "inquirer";
import { randomUUID } from "crypto";
import { auth } from "@/libs/better-auth";
import { prisma } from "@/libs/db";
const createAdmin = () => {
    const program = new Command();
    program
        .name('create-admin')
        .description('Create admin user')
        .action(async () => {
            const answers = await prompt([
                {
                    type: 'input',
                    name: 'username',
                    message: '请输入用户名:',
                    validate: (input) => {
                        if (!input) return '用户名不能为空';
                        return true;
                    }
                },
                {
                    type: 'password',
                    name: 'password',
                    message: '请输入密码:',
                    validate: (input) => {
                        if (!input) return '密码不能为空';
                        if (input.length < 6) return '密码长度不能小于6位';
                        return true;
                    }
                },
                {
                    type: 'password',
                    name: 'confirmPassword',
                    message: '请确认密码:',
                    validate: (input, answers) => {
                        if (!input) return '确认密码不能为空';
                        if (!answers || input !== answers.password) return '两次输入的密码不一致';
                        return true;
                    }
                }
            ]);
            const existingAdmin = await prisma.user.findFirst({
                where: {
                    name: answers.username,
                }
            })

            if (existingAdmin) {
                console.error('用户名已存在');
                process.exit(1);
            }
            const ctx = await auth.$context;
            const image = `https://robohash.org/${randomUUID()}`;
            const user = await ctx.internalAdapter.createUser({
                email: `${randomUUID()}@admin.local`,
                name: answers.username,
                username: answers.username,
                image,
                emailVerified: true,
                role: 'admin',
            })
            const hash = await ctx.password.hash(answers.password);
			await ctx.internalAdapter.linkAccount({
				userId: user.id,
				providerId: "credential",
				accountId: user.id,
				password: hash,
			});
            console.log('管理员创建成功');
            process.exit(0);
        });

    program.parse();
}

createAdmin();
