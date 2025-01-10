'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {UAParser} from "ua-parser-js";
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
    return <>{children}</>
  ;
}
