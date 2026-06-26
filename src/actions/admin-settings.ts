"use server";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAdminSession, clearAdminSession, setAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type ActionState = {
  error?: string;
  success?: string;
  name?: string;
  photoBase64?: string;
};

async function fileToBase64(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

export async function updateAdminProfileAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getAdminSession();

  if (!session?.id) {
    return { error: "Unauthorized." };
  }

  const name = String(formData.get("name") || "").trim();
  const imageFile = formData.get("image") as File | null;

  if (!name) {
    return {
      error: "Name is required.",
      name: prevState?.name || "",
      photoBase64: prevState?.photoBase64 || "",
    };
  }

  const userRef = doc(db, "staff", session.id);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return { error: "User not found." };
  }

  const currentUser = userSnap.data();

  const updateData: Record<string, any> = {
    name,
    updatedAt: new Date().toISOString(),
  };

  let finalPhotoBase64 = currentUser.photoBase64 || "";

  if (imageFile && imageFile.size > 0) {
    const maxSize = 1024 * 1024 * 2;

    if (imageFile.size > maxSize) {
      return {
        error: "Image must be smaller than 2MB.",
        name,
        photoBase64: finalPhotoBase64,
      };
    }

    if (!imageFile.type.startsWith("image/")) {
      return {
        error: "Only image files are allowed.",
        name,
        photoBase64: finalPhotoBase64,
      };
    }

    finalPhotoBase64 = await fileToBase64(imageFile);
    updateData.photoBase64 = finalPhotoBase64;
  }

  await updateDoc(userRef, updateData);

  await setAdminSession({
    id: session.id,
    email: session.email,
    role: session.role,
    name,
  });

  revalidatePath("/admin/settings");

  return {
    success: "Profile updated successfully.",
    name,
    photoBase64: finalPhotoBase64,
  };
}

export async function updateAdminPasswordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getAdminSession();

  if (!session?.id) {
    return { error: "Unauthorized." };
  }

  const currentPassword = String(formData.get("currentPassword") || "").trim();
  const newPassword = String(formData.get("newPassword") || "").trim();
  const confirmPassword = String(formData.get("confirmPassword") || "").trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All password fields are required." };
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New password and confirm password must match." };
  }

  const userRef = doc(db, "staff", session.id);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return { error: "User not found." };
  }

  const user = userSnap.data();

  if (user.password !== currentPassword) {
    return { error: "Current password is incorrect." };
  }

  await updateDoc(userRef, {
    password: newPassword,
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/admin/settings");
  await clearAdminSession();
  redirect("/admin/login");
}