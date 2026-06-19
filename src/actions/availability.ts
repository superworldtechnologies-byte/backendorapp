"use server";

import { doc, setDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";

function isTrue(value: FormDataEntryValue | null) {
  return String(value || "") === "true";
}

export async function updateAvailabilityAction(formData: FormData) {
  const staffId = String(formData.get("staffId") || "").trim();
  if (!staffId) return { error: "Missing staff id." };

  const availability = {
    monday: {
      enabled: isTrue(formData.get("monday_enabled")),
      start: String(formData.get("monday_start") || ""),
      end: String(formData.get("monday_end") || ""),
    },
    tuesday: {
      enabled: isTrue(formData.get("tuesday_enabled")),
      start: String(formData.get("tuesday_start") || ""),
      end: String(formData.get("tuesday_end") || ""),
    },
    wednesday: {
      enabled: isTrue(formData.get("wednesday_enabled")),
      start: String(formData.get("wednesday_start") || ""),
      end: String(formData.get("wednesday_end") || ""),
    },
    thursday: {
      enabled: isTrue(formData.get("thursday_enabled")),
      start: String(formData.get("thursday_start") || ""),
      end: String(formData.get("thursday_end") || ""),
    },
    friday: {
      enabled: isTrue(formData.get("friday_enabled")),
      start: String(formData.get("friday_start") || ""),
      end: String(formData.get("friday_end") || ""),
    },
    saturday: {
      enabled: isTrue(formData.get("saturday_enabled")),
      start: String(formData.get("saturday_start") || ""),
      end: String(formData.get("saturday_end") || ""),
    },
    sunday: {
      enabled: isTrue(formData.get("sunday_enabled")),
      start: String(formData.get("sunday_start") || ""),
      end: String(formData.get("sunday_end") || ""),
    },
  };

  await setDoc(
    doc(db, "staff", staffId),
    {
      availability,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  revalidatePath("/admin/availability");
  return { success: true };
}