import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAdminSession } from "@/lib/auth";
import { AccountSettingsForm } from "@/components/admin/settings/account-settings-form";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();

  if (!session?.id) {
    return null;
  }

  const userSnap = await getDoc(doc(db, "staff", session.id));

  if (!userSnap.exists()) {
    return (
      <div className="px-6 py-8 md:px-8">
        <p className="text-sm text-[#A0A0A0]">User not found.</p>
      </div>
    );
  }

  const user = {
    id: userSnap.id,
    ...userSnap.data(),
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 md:px-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#111111]">
          Settings
        </h1>
        <p className="text-sm text-[#6F6F6F]">
          Update your profile and password.
        </p>
      </div>

      <AccountSettingsForm admin={user} />
    </div>
  );
}