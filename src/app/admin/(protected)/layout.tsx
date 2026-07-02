import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"; 
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import "../../globals.css";

export const metadata: Metadata = {
  title: "NexPetCare | Admin Console", // Optional: Update to differentiate
  description: "Automated pet care scheduling systems",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAdminSession();

  return (
    // Replaced <html> and <body> with a <div> wrapper containing the body's CSS classes
    <div className="min-h-full bg-[#fafafa] text-zinc-900 antialiased dark:bg-[#090909] dark:text-zinc-50">
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <AdminSidebar user={session} />
          <SidebarInset className="bg-transparent">
            <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-black/5 bg-white/80 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
              <SidebarTrigger className="-ml-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100" />
              <Separator
                orientation="vertical"
                className="mr-1 h-4 bg-zinc-200 dark:bg-zinc-800"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Petromus
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Management Console
                </span>
              </div>
            </header>

            <main className="min-h-[calc(100vh-56px)] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.06),transparent_30%)] px-4 py-6 dark:bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_30%)]">
              <div className="mx-auto w-full max-w-7xl">{children}</div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}