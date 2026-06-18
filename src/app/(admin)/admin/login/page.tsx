"use client";

import { useActionState } from "react";
import {
  adminLoginAction,
  type AdminLoginState,
} from "@/actions/admin/auth";

const initialState: AdminLoginState = {
  error: null,
};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(
    adminLoginAction,
    initialState
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        action={formAction}
        className="w-full max-w-sm border p-6 rounded-md space-y-4"
      >
        <h1 className="text-xl font-semibold">
          Admin Login
        </h1>

        {state.error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">
            Email
          </label>

          <input
            name="email"
            type="email"
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Password
          </label>

          <input
            name="password"
            type="password"
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full border px-3 py-2 rounded"
        >
          {pending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}