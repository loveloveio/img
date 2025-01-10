'use client'
import { Card, CardBody,Avatar, Button, Divider, Link } from "@nextui-org/react";
import { TabLayout } from "../components/tab-layout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HeartOutlined, WalletOutlined, LockOutlined, CustomerServiceOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import { authClient } from "@/libs/better-client";
export default function Profile() {
    const { data: session,isPending} = authClient.useSession();
    const router = useRouter();
    useEffect(() => {
        if (!isPending && !session) {
            router.push("/member/mobile/sign-in")
        }
    }, [session,isPending]);

    if (!session) {
        return null;
    }
    return (
        <TabLayout>
            <div className="max-w-[400px] mx-auto mt-8 px-4">
                <Card>
                    <CardBody className="flex flex-row items-center gap-4">
                        <Avatar
                            isBordered
                            className="w-14 h-14"
                            src={session.user?.image ?? ''}
                        />
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold text-gray-900">{session.user?.name}</h2>
                            <p className="text-sm text-gray-500">ID: {session.user?.id}</p>
                        </div>
                    </CardBody>
                </Card>
                <Card className="mt-4">
                    <CardBody className="gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">会员信息</h3>
                            <p className="text-sm text-gray-500">
                                到期时间: {session.user?.vipExpiredAt ? dayjs(session.user?.vipExpiredAt).format('YYYY-MM-DD') : '暂未开通'}
                            </p>
                        </div>
                        <Button onPress={() => {
                            router.push("/member/mobile/top-up");
                        }} fullWidth color="primary" variant="shadow">
                            立即充值
                        </Button>
                    </CardBody>
                </Card>
                <Card className="mt-4">
                    <CardBody className="gap-4 p-4">
                        <div className="space-y-2">
                            <Link href="/member/mobile/likes" className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100">
                                <HeartOutlined className="mr-2" />
                                我的喜欢
                                <RightOutlined className="ml-auto" />
                            </Link>
                            <Divider className="bg-gray-200 dark:bg-gray-700" />
                            <Link href="/member/mobile/orders" className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100">
                                <WalletOutlined className="mr-2" />
                                我的订单
                                <RightOutlined className="ml-auto" />
                            </Link>
                            <Divider className="bg-gray-200 dark:bg-gray-700" />
                            <Link href="/member/mobile/change-password" className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100">
                                <LockOutlined className="mr-2" />
                                修改密码
                                <RightOutlined className="ml-auto" />
                            </Link>
                            <Divider className="bg-gray-200 dark:bg-gray-700" />
                            <Link href="#" target="_blank" className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100">
                                <CustomerServiceOutlined className="mr-2" />
                                联系客服
                                <RightOutlined className="ml-auto" />
                            </Link>
                        </div>
                    </CardBody>
                </Card>
                <Button className="w-[80%] mt-16 mx-auto block" onPress={async () => {
                    await authClient.signOut()
                    router.push("/member/mobile/sign-in")
                }} color="danger" variant="bordered">
                    退出登录
                </Button>
            </div>
        </TabLayout>
    );
}
