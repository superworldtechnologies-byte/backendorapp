"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  updateAdminPasswordAction,
  updateAdminProfileAction,
} from "@/actions/admin-settings";
import { Button } from "@/components/ui/button";

const initialState = {
  error: "",
  success: "",
  name: "",
  photoBase64: "",
};

function getInitials(name: string) {
  return (
    name
      ?.trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AD"
  );
}

export function AccountSettingsForm({ admin }: { admin: any }) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateAdminProfileAction,
    {
      ...initialState,
      name: admin.name || "",
      photoBase64: admin.photoBase64 || "",
    }
  );

  const [passwordState, passwordAction, passwordPending] = useActionState(
    updateAdminPasswordAction,
    initialState
  );

  const [name, setName] = useState(admin.name || "");
  const [preview, setPreview] = useState(admin.photoBase64 || "");

  useEffect(() => {
    if (profileState?.name && profileState.name !== name) {
      setName(profileState.name);
    }
  }, [profileState?.name]);

  useEffect(() => {
    if (profileState?.photoBase64) {
      setPreview(profileState.photoBase64);
    }
  }, [profileState?.photoBase64]);

  const avatarSrc = useMemo(() => {
    return preview || admin.photoBase64 || "";
  }, [preview, admin.photoBase64]);

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your name and profile image.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            action={profileAction}
            encType="multipart/form-data"
            className="space-y-5"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={avatarSrc || undefined}
                  alt={name || "Admin"}
                />
                <AvatarFallback>
                  {getInitials(name || "Admin")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <Label htmlFor="image">Profile picture</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = () => {
                      setPreview(String(reader.result || ""));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Upload JPG, PNG, or WebP under 2MB.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={admin.email || ""}
                disabled
                readOnly
              />
            </div>

            {profileState?.error && (
              <p className="text-sm text-red-500">
                {profileState.error}
              </p>
            )}

            {profileState?.success && (
              <p className="text-sm text-green-600">
                {profileState.success}
              </p>
            )}

            <Button
              type="submit"
              
              disabled={profilePending}
            >
              {profilePending ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Card */}
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password. You will log in again after updating it.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={passwordAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">
                Current password
              </Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="New password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
              />
            </div>

            {passwordState?.error && (
              <p className="text-sm text-red-500">
                {passwordState.error}
              </p>
            )}

            <Button
              type="submit"
              
              disabled={passwordPending}
            >
              {passwordPending
                ? "Updating..."
                : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}