import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"; 
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import "../../globals.css";



export const metadata: Metadata = {
  title: "NexPetCare | Booking Engine",
  description: "Automated pet care scheduling systems",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAdminSession();

  return (
    <html
      lang="en"
      className={` h-full antialiased`}
    >
      <body 
        suppressHydrationWarning 
        className="h-full bg-zinc-50/50  text-sm text-zinc-900 antialiased tracking-normal dark:bg-zinc-950 dark:text-zinc-50"
      >
        <TooltipProvider delayDuration={0}>
          <SidebarProvider>
            <AdminSidebar user={session} />
            
            <SidebarInset className="bg-white dark:bg-zinc-900">
              {/* Header */}
              <header className="flex h-14 shrink-0 items-center gap-2 border-b border-zinc-100 px-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 dark:border-zinc-800 dark:bg-zinc-900/80">
                <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-[#4d4bcf] transition-colors" />
                <Separator
                  orientation="vertical"
                  className="mr-2 h-4 bg-zinc-200 dark:bg-zinc-800"
                />
                {/* Clean tracking look on labels */}
                <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase font-mono dark:text-zinc-500">
                  Management Console
                </span>
              </header>

              {/* Viewport */}
              <main className="flex-1 w-full p-4 bg-white dark:bg-zinc-900">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}