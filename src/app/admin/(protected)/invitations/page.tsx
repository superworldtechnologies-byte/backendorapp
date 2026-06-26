import { InviteStaffForm } from "@/components/admin/invite-staff-form";
import { UserPlus } from "lucide-react";

export default function InvitationsPage() {
  return (
    <div className="mx-auto max-w-2xl py-6 space-y-6">
      {/* Page Header with Icon */}
      <div className="flex items-center gap-4">
        
        <div>
          <h1 className="text-2xl font-semibold  text-foreground">
            Invite Staff
          </h1>
          <p className="text-sm text-muted-foreground">
            Add new team members to your workspace and assign their credentials.
          </p>
        </div>
      </div>

      {/* Form Component */}
      <InviteStaffForm />
    </div>
  );
}