"use client";

import { logoutAdmin } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAdmin}>
      <Button type="submit" variant="outline" className="w-full">
        Logout
      </Button>
    </form>
  );
}