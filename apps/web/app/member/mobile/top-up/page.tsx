'use client'
import { NavBar } from "@/member/mobile/components/nav-bar";
import { PaymentMethod, VipPackage } from "@prisma/client";
import { useState, useEffect, useCallback } from "react";
import { Checkbox } from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
export default function TopupPage() {
  const [vipPackages, setVipPackages] = useState<VipPackage[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedVipPackage, setSelectedVipPackage] = useState<number | null>(null);
  const fetchVipPackages = useCallback(async () => {
    const response = await axios.get('/api/member/vip-packages');
    if(response.data.code === 200 && response.data.data.vipPackages){
      setVipPackages(response.data.data.vipPackages);
      setSelectedVipPackage(response.data.data.vipPackages[0].id);
    }
  }, []);
  const fetchPaymentMethods = useCallback(async () => {
    const response = await axios.get('/api/member/payment-methods');
    if(response.data.code === 200 && response.data.data.paymentMethods){
      
      setPaymentMethods(response.data.data.paymentMethods);
    }
  }, []);
  useEffect(() => {
    fetchVipPackages();
    fetchPaymentMethods();
  }, []);
  return <div className="flex flex-col h-screen">
    <NavBar title="充值" />
    <div className="flex-1 p-4">
      <div className="grid grid-cols-2 gap-4">
        {vipPackages.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedVipPackage(Number(item.id))}
            className={`cursor-pointer rounded-lg shadow ${selectedVipPackage === Number(item.id) ? "border-2 border-primary" : "border border-gray-200"}`}
          >
            <div className="relative flex flex-col items-center pb-4">
              <div className="flex flex-col items-center mt-4">
                <h2 className="text-base font-semibold truncate">{item.title}</h2>
                <p className="text-xs text-gray-500 truncate">{item.subtitle || '\u00A0'}</p>
              </div>
              <div className="flex items-center justify-center mt-2">
                <span className="text-base font-bold text-orange-500">¥{Number(item.price)}</span>
              </div>
              <div className="absolute bottom-0 right-0">
                {selectedVipPackage === Number(item.id) && <Checkbox name="vipPackage" isSelected={true} />}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">支付方式</h2>
        <div className="space-y-4">
          {paymentMethods.map(item => (
            <div key={item.id} onClick={() => {
              axios.post('/api/member/orders', {
                paymentMethodId: item.id,
                vipPackageId: selectedVipPackage,
              }).then(response => {
                console.log('response', response);
                if (response.data.code === 200) {
                  window.location.href = response.data.data.redirectUrl;
                } else {
                  toast.error(response.data.message, {
                    position: 'top-center',
                  });
                }
              }).catch(error => {
                toast.error(error.message);
                console.log('error', error);
              });
            }} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer">
              <div className="flex items-center">
                <img src={item.icon || ''} alt={item.name} className="w-8 h-8 mr-3" />
                <span className="text-base">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>;
}
