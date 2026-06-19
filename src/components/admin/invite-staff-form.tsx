"use client";

import { useActionState } from "react";
import { inviteStaff } from "@/actions/staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {
  error: "",
  success: "",
};

export function InviteStaffForm() {
  const [state, formAction, pending] = useActionState(inviteStaff, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Amy Chen" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="amy@petromus.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="text" placeholder="temporary password" />
      </div>

      {state?.error ? <p className="text-sm text-red-500">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-green-600">{state.success}</p> : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Invite Staff"}
      </Button>
    </form>
  );
}