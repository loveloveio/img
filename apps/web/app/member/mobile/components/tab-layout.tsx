'use client';
import { BottomTabs } from "./bottom-tabs";

export const TabLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1">
        {children}
      </div>
      <BottomTabs />
    </div>
  );
};