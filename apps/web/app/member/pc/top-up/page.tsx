'use client'
import { PaymentMethod, VipPackage } from "@prisma/client";
import { useState, useEffect } from "react";
import { Card, Layout, Typography, Radio, Button, message } from "antd";
import axios from "axios";
import Image from "next/image";
const { Content } = Layout;
const { Title } = Typography;

export default function TopupPage() {
  const [vipPackages, setVipPackages] = useState<VipPackage[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedVipPackage, setSelectedVipPackage] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);

  const fetchVipPackages = async () => {
    const response = await axios.get('/api/member/vip-packages');
    if(response.data.code === 200 && response.data.data.vipPackages){
      setVipPackages(response.data.data.vipPackages);
      setSelectedVipPackage(response.data.data.vipPackages[0].id);
    }
  }

  const fetchPaymentMethods = async () => {
    const response = await axios.get('/api/member/payment-methods');
    if(response.data.code === 200 && response.data.data.paymentMethods){
      setPaymentMethods(response.data.data.paymentMethods);
      if(response.data.data.paymentMethods.length > 0) {
        setSelectedPaymentMethod(response.data.data.paymentMethods[0].id);
      }
    }
  }

  const handleSubmit = () => {
    if(!selectedVipPackage || !selectedPaymentMethod) {
      message.error('请选择套餐和支付方式');
      return;
    }

    axios.post('/api/member/orders', {
      paymentMethodId: selectedPaymentMethod,
      vipPackageId: selectedVipPackage,
    }).then(response => {
      if (response.data.code === 200) {
        window.location.href = response.data.data.redirectUrl;
      } else {
        message.error(response.data.message);
      }
    }).catch(error => {
      message.error(error.message);
      console.log('error', error);
    });
  }

  useEffect(() => {
    fetchVipPackages();
    fetchPaymentMethods();
  }, []);

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Content className="max-w-4xl mx-auto py-8 px-4">
        <Card>
          <Title level={4} className="mb-6">选择充值套餐</Title>
          <Radio.Group 
            value={selectedVipPackage} 
            onChange={e => setSelectedVipPackage(e.target.value)}
            className="w-full"
          >
            <div className="grid grid-cols-3 gap-4">
              {vipPackages.map(item => (
                <Card
                  key={item.id}
                  hoverable
                  className={`cursor-pointer ${selectedVipPackage === Number(item.id) ? 'border-primary border-2' : ''}`}
                >
                  <Radio value={Number(item.id)} className="w-full">
                    <div className="text-center">
                      <div className="font-medium text-lg mb-2">{item.title}</div>
                      <div className="text-gray-500 text-sm mb-2">{item.subtitle}</div>
                      <div className="text-primary text-xl font-bold">¥{Number(item.price)}</div>
                    </div>
                  </Radio>
                </Card>
              ))}
            </div>
          </Radio.Group>

          <Title level={4} className="mt-8 mb-6">选择支付方式</Title>
          <Radio.Group 
            value={selectedPaymentMethod}
            onChange={e => setSelectedPaymentMethod(e.target.value)}
            className="w-full"
          >
            <div className="space-y-4">
              {paymentMethods.map(item => (
                <Card 
                  key={item.id}
                  hoverable 
                  className={`cursor-pointer ${selectedPaymentMethod === Number(item.id) ? 'border-primary border-2' : ''}`}
                >
                  <Radio value={Number(item.id)} className="w-full">
                    <div className="flex items-center">
                      <Image src={item.icon || ''} alt={item.name} className="w-8 h-8 mr-3" />
                      <span className="text-base">{item.name}</span>
                    </div>
                  </Radio>
                </Card>
              ))}
            </div>
          </Radio.Group>

          <div className="mt-8 text-center">
            <Button 
              type="primary" 
              size="large"
              onClick={handleSubmit}
            >
              立即支付
            </Button>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}
