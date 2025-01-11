'use client'
import React, { useState, useEffect } from 'react'
import { ProLayout } from '@ant-design/pro-components'
import { LogoutOutlined, DashboardOutlined, ShoppingOutlined, PictureOutlined, PayCircleOutlined, TagsOutlined, ApiOutlined, CloudServerOutlined, GiftOutlined, GiftTwoTone, CreditCardOutlined, CrownOutlined, GlobalOutlined, UserOutlined } from '@ant-design/icons'
import { authClient } from '@/libs/better-client';
import { Button, Modal, Breadcrumb } from 'antd'
import { usePathname, useRouter } from 'next/navigation'

export interface MainLayoutProps {
  children: React.ReactNode
}
export const MainLayout = ({ children }: MainLayoutProps) => {
  const getCollapsed = () => {
    if (typeof window === 'undefined') {
      return false
    }
    const url = new URL(window.location.href)
    const collapsedParam = url.searchParams.get('collapsed')
    return collapsedParam === 'true'
  }

  const [pathname, setPathname] = useState('/dashboard')
  const [collapsed, setCollapsed] = useState(getCollapsed())
  const [isClient, setIsClient] = useState(false)
  const currentPathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const menuItems = [
    {
      path: '/admin/dashboard',
      name: '控制台',
      icon: <DashboardOutlined />,
    },
    {
      path: '/admin/orders',
      name: '订单管理',
      icon: <ShoppingOutlined />,
    },
    {
      path: '/admin/photo-collections',
      name: '图集管理',
      icon: <PictureOutlined />,
    },
    {
      path: '/admin/payment-methods',
      name: '支付方法管理',
      icon: <PayCircleOutlined />,
    },
    {
      path: '/admin/tags',
      name: '标签管理',
      icon: <TagsOutlined />,
    },
    // {
    //   path: '/admin/service-endpoints',
    //   name: '服务端点管理',
    //   icon: <ApiOutlined />,
    // },
    // {
    //   path: '/admin/proxy-nodes',
    //   name: '代理节点管理',
    //   icon: <CloudServerOutlined />,
    // },
    // {
    //   path: '/admin/gift-card-packages',
    //   name: '礼品卡套餐管理',
    //   icon: <GiftOutlined />,
    // },
    // {
    //   path: '/admin/gift-cards',
    //   name: '礼品卡管理',
    //   icon: <CreditCardOutlined />,
    // },
    // {
    //   path: '/admin/vip-packages',
    //   name: 'VIP套餐管理',
    //   icon: <CrownOutlined />,
    // },
    // {
    //   path: '/admin/sites',
    //   name: '站点管理',
    //   icon: <GlobalOutlined />,
    // },
    {
      path: '/admin/users',
      name: '用户管理',
      icon: <UserOutlined />,
    },
  ]

  const getBreadcrumbItems = () => {
    const matchedItem = menuItems.find(item => item.path === currentPathname)
    return matchedItem
      ? [
        { title: '首页' },
        { title: matchedItem.name }
      ]
      : [{ title: '首页' }]
  }
  if (!isClient) {
    return null
  }

  return (
    <ProLayout
      layout="side"
      title="后台管理系统"
      location={{
        pathname: currentPathname,
      }}
      breakpoint={false}
      defaultCollapsed={collapsed}
      collapsed={collapsed}
      onCollapse={(state) => {
        console.log("onCollapse####",state)
        setCollapsed(state)
        const url = new URL(window.location.href)
        url.searchParams.set('collapsed', state ? 'true' : 'false')
        window.history.replaceState({}, '', url.toString())
      }}
      menuProps={{
        defaultSelectedKeys: [pathname],
        onSelect: ({ key }) => {
          const selectedItem = menuItems.find(item => item.path === key)
          if (selectedItem) {
            setPathname(key as string)
            const url = new URL(window.location.href)
            url.searchParams.set('collapsed', collapsed ? 'true' : 'false')
            window.history.replaceState({}, '', url.toString())
          }
        },
      }}
      menuItemRender={(item, dom) => (
        <a onClick={() => {
          const path = item.path || '/admin/dashboard';
          window.location.href = `${path}?collapsed=${collapsed ? 'true' : 'false'}`
        }}>
          {dom}
        </a>
      )}
      menuDataRender={() => menuItems}
      actionsRender={() => (
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={() => {
            Modal.confirm({
              title: '确认退出',
              content: '您确定要退出系统吗？',
              onOk() {
                authClient.signOut()
                router.push('/admin/sign-in')
              },
            })
          }}
        >
          退出{collapsed ? '展开' : '折叠'}
        </Button>
      )}
    >
      <Breadcrumb
        style={{ margin: '16px 0' }}
        items={getBreadcrumbItems()}
      />
      {children}
    </ProLayout>
  )
}