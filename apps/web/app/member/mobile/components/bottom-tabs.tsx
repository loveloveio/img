'use client';
import React from 'react';
import Link from 'next/link';
import { HomeOutlined, CrownOutlined, UserOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';

export const BottomTabs = () => {
  const pathname = usePathname();

  const tabs = [
    { href: '/member/mobile', icon: <HomeOutlined />, label: '首页' },
    { href: '/member/mobile/vip-manual', icon: <CrownOutlined />, label: 'VIP说明' },
    { href: '/member/mobile/profile', icon: <UserOutlined />, label: '个人中心' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex justify-around py-2 z-50">
      {tabs.map((tab) => (
        <Link 
          key={tab.href} 
          href={tab.href} 
          className={`flex flex-col items-center justify-center ${
            pathname === tab.href 
              ? 'text-primary-500 dark:text-primary-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <div className="text-base">{tab.icon}</div>
          <span className="text-[10px] mt-1">{tab.label}</span>
        </Link>
      ))}
    </div>
  );
};
