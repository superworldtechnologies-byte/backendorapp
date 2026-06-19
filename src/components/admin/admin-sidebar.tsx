import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";

export function AdminSidebar({ user }: { user: any }) {
  return (
    <aside className="border-r bg-background p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Petromus Admin</h2>
        <p className="text-sm text-muted-foreground">{user.name}</p>
      </div>

      <nav className="space-y-2">
        <Link href="/admin" className="block rounded-md px-3 py-2 hover:bg-muted">
          Dashboard
        </Link>
        <Link href="/admin/invitations" className="block rounded-md px-3 py-2 hover:bg-muted">
          Invitations
        </Link>
        <Link href="/admin/services" className="block rounded-md px-3 py-2 hover:bg-muted">
            Services
        </Link>
        <Link href="/admin/availability" className="block rounded-md px-3 py-2 hover:bg-muted">
            Availability
        </Link>
        <Link href="/admin/analytics" className="block rounded-md px-3 py-2 hover:bg-muted">
            Analytics
        </Link>
        <Link href="/admin/coupons" className="block rounded-md px-3 py-2 hover:bg-muted">
            Coupons
        </Link>
      </nav>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}