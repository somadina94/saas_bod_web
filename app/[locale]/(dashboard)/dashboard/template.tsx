"use client";

import { MotionPage } from "@/components/atoms/motion-page";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionPage className="flex flex-1 flex-col">{children}</MotionPage>
  );
}
