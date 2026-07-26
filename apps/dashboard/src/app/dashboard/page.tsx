import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-steam-bg" />}>
      <DashboardShell />
    </Suspense>
  );
}
