"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavBar } from "@/member/mobile/components/nav-bar";
import { Input, Button } from "@nextui-org/react";
import { z, ZodIssue } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-hot-toast';
import  { AxiosError } from 'axios'
import { ERROR_CODES } from "@/libs/error-codes";
import { authClient } from "@/libs/better-client";
const frontSignInSchema = z.object({
    username: z.string().min(3, "用户名至少3个字符").max(18, '用户名最长18个字符'),
    password: z.string()
        .min(6, "密码至少6个字符")
        .max(32, "密码最长32个字符")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,32}$/, "密码必须包含字母和数字")
})
type SignInForm = z.infer<typeof frontSignInSchema>;

export default function SignInPage() {
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { control, handleSubmit, formState: { errors }, setError } = useForm<SignInForm>({
        resolver: zodResolver(frontSignInSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    });

    useEffect(() => {
        if (session?.user) {
            router.back();
        }
    }, [session, router]);

    const handleSignIn = async (data: SignInForm) => {
        setIsLoading(true);
        try {
            await authClient.signIn.username({
                username: data.username,
                password: data.password,
                rememberMe: true,
            });
            toast.success('登录成功 👋!', {
                position: 'top-center',
            });
            router.push('/member/mobile');
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                const code = error.response?.data.code || 400;
                if (code == ERROR_CODES.FORM_VALIDATION_FAILED) {
                    const errors = (error.response?.data.data.errors ?? []) as ZodIssue[]
                    errors.forEach(error => {
                        setError(error.path[0] as keyof SignInForm, {
                            type: 'manual',
                            message: error.message
                        });
                    });
                    return;
                }
            }
            toast.error('登录失败', {
                position: 'top-center',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToSignUp = () => {
        router.push('/member/mobile/sign-up');
    };

    const handleGoToHome = () => {
        router.push('/member/mobile');
    };
    return (
        <div className="flex flex-col h-screen">
            <NavBar title="登录" />
            <div className="flex flex-col items-center py-4 mt-20">
                <h1 className="text-xl font-bold">您的应用名称</h1>
            </div>
            <div className="p-4 mt-20">
                <form method="post" onSubmit={(e) => {
                    e.preventDefault();
                    if (!isLoading) {
                        handleSubmit(handleSignIn)();
                    }
                }} className="flex flex-col space-y-4">
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="请输入账号"
                                errorMessage={errors.username?.message}
                                isInvalid={!!errors.username}
                                color={errors.username ? "danger" : "default"}
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="请输入密码"
                                type="password"
                                isInvalid={!!errors.password}
                                errorMessage={errors.password?.message}
                                color={errors.password ? "danger" : "default"}
                            />
                        )}
                    />
                    <Button
                        color="primary"
                        type="submit"
                        isLoading={isLoading}
                        className="mt-4"
                    >
                        登录
                    </Button>
                    <Button
                        variant="bordered"
                        onPress={handleGoToSignUp}
                    >
                        没有账号？去注册
                    </Button>
                    <Button
                        variant="bordered"
                        onPress={handleGoToHome}
                    >
                        返回首页
                    </Button>
                </form>
            </div>
        </div>
    )
}