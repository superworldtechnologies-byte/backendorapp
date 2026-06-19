import { InviteStaffForm } from "@/components/admin/invite-staff-form";

export default function InvitationsPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Invite Staff</h1>
      <InviteStaffForm />
    </div>
  );
}