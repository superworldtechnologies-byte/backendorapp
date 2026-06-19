import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Admin Login</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Login with your email and password
        </p>
        <LoginForm />
      </div>
    </div>
  );
}