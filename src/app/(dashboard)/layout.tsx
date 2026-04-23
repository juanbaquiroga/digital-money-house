"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isHydrated, hydrateSession } = useAuthStore();
  const { fetchProfileData, account, isLoading } = useProfileStore();

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (isHydrated && token && !account && !isLoading) {
      fetchProfileData();
    }
  }, [isHydrated, token, account, isLoading, fetchProfileData]);

  return (
    <div className="flex flex-1 w-full bg-surface-light min-h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
