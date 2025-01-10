'use client';
import '@ant-design/v5-patch-for-react-19';
import { Layout } from "antd";
import NavBar from "./components/nav-bar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {UAParser} from "ua-parser-js";
const { Content } = Layout;
export default function RootLayout({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    useEffect(() => {
        const ua = UAParser(window.navigator.userAgent);
        if (ua.device.is('mobile') && !location.href.startsWith('/member/pc')) {
            // 将pc页面重定向到移动端页面
            router.push(location.href.replace('pc', 'mobile'));
        }else if (!ua.device.is('mobile') && !location.href.startsWith('/member/mobile')) {
            // 将移动端页面重定向到pc页面
            router.push(location.href.replace('mobile', 'pc'));
        }   
    }, []);
    return <Layout className="flex w-screen min-h-screen">
        <NavBar />
        <Content className="flex-1 w-full h-full">
            {children}
        </Content>
    </Layout>
  ;
}
