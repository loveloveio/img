'use client'
import { PageContainer } from '@ant-design/pro-components';
import List from './components/List';
import { MainLayout } from '@/admin/components/main-layout';
export default function PaymentMethodsPage() {
  return (
    <MainLayout>
      <PageContainer title="支付方法管理">
        <List />
      </PageContainer>
    </MainLayout>
  );
}