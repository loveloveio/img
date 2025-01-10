'use client'
import { NavBar } from "@/member/mobile/components/nav-bar";
import { useRouter } from "next/navigation";
import { Input, Button } from "@nextui-org/react";
import { useState } from "react";
import { authClient } from "@/libs/better-client";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("新密码与确认密码不一致");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authClient.changePassword({
        currentPassword,
        newPassword
      });

      if (res?.error) {
        throw new Error(res.error.message);
      }

      toast.success("密码修改成功");
      router.push("/member/mobile/profile");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "密码修改失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <NavBar title="修改密码" />
      <div className="flex-1 p-4">
        <div className="space-y-4">
          <Input
            label="当前密码"
            type="password"
            value={currentPassword}
            onValueChange={setCurrentPassword}
            isRequired
            minLength={6}
            maxLength={32}
            description="密码长度6-32位"
          />
          <Input
            label="新密码"
            type="password"
            value={newPassword}
            onValueChange={setNewPassword}
            isRequired
            minLength={6}
            maxLength={32}
            description="必须包含字母和数字，长度6-32位"
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,32}$"
          />
          <Input
            label="确认新密码"
            type="password"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            isRequired
            minLength={6}
            maxLength={32}
          />
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isLoading={isLoading}
            fullWidth
          >
            确认修改
          </Button>
        </div>
      </div>
    </div>
  );
}