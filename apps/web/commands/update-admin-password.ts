import { prisma } from "@/libs/db";
import { Command } from "commander";
import { prompt } from "inquirer";
import { auth } from "@/libs/better-auth";

const updateAdminPassword = () => {
    const program = new Command();
    program
        .name('update-admin-password')
        .description('Update admin password')
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
                    message: '请输入新密码:',
                    validate: (input) => {
                        if (!input) return '密码不能为空';
                        if (input.length < 6) return '密码长度不能小于6位';
                        return true;
                    }
                },
                {
                    type: 'password',
                    name: 'confirmPassword',
                    message: '请确认新密码:',
                    validate: (input, answers) => {
                        if (!input) return '确认密码不能为空';
                        if (!answers || input !== answers.password) return '两次输入的密码不一致';
                        return true;
                    }
                }
            ]);

            const admin = await prisma.user.findFirst({
                where: { username:answers.username }
            });

            if (!admin) {
                console.error('用户不存在');
                process.exit(1);
            }

            const ctx = await auth.$context;
            const hashedPassword = await ctx.password.hash(answers.password);

            await ctx.internalAdapter.updatePassword(admin.id, hashedPassword);

            console.log('密码更新成功');
            process.exit(0);
        });

    program.parse();
}

updateAdminPassword();
