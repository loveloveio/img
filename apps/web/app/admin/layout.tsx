'use client';
import React from 'react';
import { ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ConfigProvider>
        <AntdRegistry>{children}</AntdRegistry>
      </ConfigProvider>
      <Toaster />
    </>
  );
}
