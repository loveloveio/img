'use client'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, FormInstance, Input, Typography, message } from 'antd';
import { authClient } from "@/libs/better-client"
import { useRef } from 'react';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
const signInSchema = z.object({
    username: z.string().min(3, "用户名至少3个字符").max(18, '用户名最长18个字符'),
    password: z.string()
        .min(6, "密码至少6个字符")
        .max(32, "密码最长32个字符")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,32}$/, "密码必须包含字母和数字"),
    rememberMe: z.boolean().optional(),
});
export default function Page() {
    const formRef = useRef<FormInstance>(null);
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f0f2f5'
        }}>
            <Card style={{ width: 400 }}>
                <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
                    后台管理
                </Typography.Title>

                <Form
                    name="signin"
                    initialValues={{ remember: true }}
                    ref={formRef}
                    onSubmitCapture={async (e) => {
                        e.preventDefault();
                        const formData = formRef.current?.getFieldsValue();
                        const username = formData?.username;
                        const password = formData?.password;
                        const rememberMe = formData?.rememberMe;

                        try {
                            await signInSchema.parseAsync({ username, password });
                            const result = await authClient.signIn.username({
                                username,
                                password,
                                rememberMe:rememberMe ? true : false
                            })
                            console.log("result", result);
                            if (result?.error) {
                                console.log("result.error", result.error);
                                toast.error("用户名或密码错误", {
                                    position: 'top-center',
                                })
                            } else {
                                window.location.href = "/admin/dashboard"
                            }
                        } catch (error) {
                            console.log("error", error);
                            if (error instanceof z.ZodError) {
                                const errors = error.errors.map(err => err.message);
                                message.error(errors.join('\n'));
                            }
                        }
                    }}
                    method="post"
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: '请输入用户名!' },
                            { min: 3, message: '用户名至少3个字符' },
                            { max: 18, message: '用户名最长18个字符' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="用户名"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: '请输入密码!' },
                            { min: 6, message: '密码至少6个字符' },
                            { max: 32, message: '密码最长32个字符' },
                            {
                                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,32}$/,
                                message: '密码必须包含字母和数字'
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="密码"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>记住我</Checkbox>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                        >
                            立即登陆
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}