import { AuthGate } from "@/components/auth-gate";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Navbar />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AuthGate>
  );
}

