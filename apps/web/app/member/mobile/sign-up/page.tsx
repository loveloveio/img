"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavBar } from "@/member/mobile/components/nav-bar";
import { Input, Button } from "@nextui-org/react";
import { z, ZodIssue } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios'
import { ERROR_CODES } from "@/libs/error-codes";
import { authClient } from "@/libs/better-client";
const frontSignUpSchema = z.object({
    username: z.string().min(3, "用户名至少3个字符").max(18, '用户名最长18个字符'),
    password: z.string()
        .min(6, "密码至少6个字符")
        .max(32, "密码最长32个字符")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,32}$/, "密码必须包含字母和数字"),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "密码不匹配",
    path: ["confirmPassword"]
});

type SignUpForm = z.infer<typeof frontSignUpSchema>;

export default function SignUpPage() {
    const { data: session } = authClient.useSession();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { control, handleSubmit, formState: { errors }, setError } = useForm<SignUpForm>({
        resolver: zodResolver(frontSignUpSchema),
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: ''
        }
    });

    useEffect(() => {
        if (session?.user) {
            router.back();
        }
    }, [session, router]);
    const handleSignUp = async (data: SignUpForm) => {
        setIsLoading(true);
        try {
            await authClient.signUp.email({
                email: `${window.crypto.randomUUID()}@member.local`,
                name: data.username,
                image: `https://robohash.org/${window.crypto.randomUUID()}`,
                username: data.username,
                password: data.password
            });
            toast.success('注册成功 👋!', {
                position: 'top-center',
            });
            setTimeout(() => {
                router.push('/member/mobile/profile');
            }, 1000)
        } catch (error) {
            if (error instanceof AxiosError) {
                const code = error.response?.data.code || 400;
                if (code == ERROR_CODES.FORM_VALIDATION_FAILED) {
                    const errors = (error.response?.data.data.errors ?? []) as ZodIssue[]
                    errors.forEach(error => {
                        setError(error.path[0] as keyof SignUpForm, {
                            type: 'manual',
                            message: error.message
                        });
                    });
                    return;
                }

            }
            toast.error('注册失败', {
                position: 'top-center',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToSignIn = () => {
        router.push('/member/mobile/sign-in');
    };

    const handleGoToHome = () => {
        router.push('/member/mobile');
    };

    return (
        <div className="flex flex-col h-screen">
            <NavBar title="注册" />
            <div className="flex flex-col items-center py-4 mt-20">
                <h1 className="text-xl font-bold">您的应用名称</h1>
            </div>
            <div className="p-4 mt-20">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!isLoading) {
                        handleSubmit(handleSignUp)();
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
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="确认密码"
                                type="password"
                                isInvalid={!!errors.confirmPassword}
                                errorMessage={errors.confirmPassword?.message}
                                color={errors.confirmPassword ? "danger" : "default"}
                            />
                        )}
                    />
                    <Button
                        color="primary"
                        type="submit"
                        isLoading={isLoading}
                        className="mt-4"
                    >
                        提交注册
                    </Button>
                    <Button
                        variant="bordered" 
                        onPress={handleGoToSignIn}
                    >
                        已有账号？去登录
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