import { adminLogoutAction } from "@/actions/admin/auth";

export default function AdminDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2">Login working. Protected route working.</p>

      <form action={adminLogoutAction} className="mt-6">
        <button type="submit" className="border px-3 py-2 rounded">
          Logout
        </button>
      </form>
    </div>
  );
}