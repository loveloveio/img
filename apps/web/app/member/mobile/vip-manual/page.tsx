'use client'
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { TabLayout } from '../components/tab-layout';

export default function VIPManual() {
  return (
    <TabLayout>
      <>
        <div className="bg-gray-50 pb-[100px]">
          <div className="p-4">
            <h2 className="text-xl text-gray-400 text-center mb-6">VIP说明</h2>

            {/* VIP Rules */}
            <div className="space-y-4 mb-8">
              <p className="text-sm text-gray-600 leading-relaxed">
                1、除免费欣赏作品外，其他所有的作品均为VIP会员才可以订阅欣赏，图片作品需要VIP1或以上，视频需要VIP2或以上等级。
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                2、作品列表里面的作品，所有VIP会员均可直接欣赏、下载等。精选作品及视频，需要花费一定数量的雅币才可以订阅欣赏。
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                3、雅币做为订阅精选作品和视频用的一种虚拟币，开通会员时均有赠送一定数量的雅币，雅币用完后，可通过充值购买。
              </p>
            </div>

            {/* VIP Table */}
            <Card className="w-full">
              <CardHeader className="flex justify-center border-b">
                <h3 className="text-gray-400">VIP等级及费用说明</h3>
              </CardHeader>
              <CardBody className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left font-normal text-gray-600 border-b">服务项目</th>
                        <th className="py-3 px-4 text-center font-normal text-gray-600 border-b">VIP1</th>
                        <th className="py-3 px-4 text-center font-normal text-gray-600 border-b">VIP2</th>
                        <th className="py-3 px-4 text-center font-normal text-gray-600 border-b">VIP3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-3 px-4 border-b">服务时长</td>
                        <td className="py-3 px-4 text-center border-b">1年</td>
                        <td className="py-3 px-4 text-center border-b">1年</td>
                        <td className="py-3 px-4 text-center border-b">2年</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b">价格</td>
                        <td className="py-3 px-4 text-center border-b text-orange-400">¥198元</td>
                        <td className="py-3 px-4 text-center border-b text-orange-400">¥268元</td>
                        <td className="py-3 px-4 text-center border-b text-orange-400">¥498元</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b">赠送雅币</td>
                        <td className="py-3 px-4 text-center border-b">1980雅币</td>
                        <td className="py-3 px-4 text-center border-b">2680雅币</td>
                        <td className="py-3 px-4 text-center border-b">5000雅币</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b">充值优惠</td>
                        <td className="py-3 px-4 text-center border-b">无优惠</td>
                        <td className="py-3 px-4 text-center border-b">9.5折</td>
                        <td className="py-3 px-4 text-center border-b">9.0折</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b">可订类型</td>
                        <td className="py-3 px-4 text-center border-b">图片</td>
                        <td className="py-3 px-4 text-center border-b">图片+视频</td>
                        <td className="py-3 px-4 text-center border-b">图片+视频</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b">影院级欣赏</td>
                        <td className="py-3 px-4 text-center border-b">支持</td>
                        <td className="py-3 px-4 text-center border-b">支持</td>
                        <td className="py-3 px-4 text-center border-b">支持</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b">图片像素</td>
                        <td className="py-3 px-4 text-center border-b">千万级</td>
                        <td className="py-3 px-4 text-center border-b">千万级</td>
                        <td className="py-3 px-4 text-center border-b">千万级</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b">质量精度</td>
                        <td className="py-3 px-4 text-center border-b">300DPI+</td>
                        <td className="py-3 px-4 text-center border-b">300DPI+</td>
                        <td className="py-3 px-4 text-center border-b">300DPI+</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b">网盘下载</td>
                        <td className="py-3 px-4 text-center border-b">支持</td>
                        <td className="py-3 px-4 text-center border-b">支持</td>
                        <td className="py-3 px-4 text-center border-b">支持</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </>
    </TabLayout>
    );  
};
