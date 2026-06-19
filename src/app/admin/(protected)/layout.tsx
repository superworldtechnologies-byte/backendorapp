import { requireAdminSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <AdminSidebar user={session} />
      <main className="p-6">{children}</main>
    </div>
  );
}