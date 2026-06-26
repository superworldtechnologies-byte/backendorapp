"use client";

import { useActionState } from "react";
import { inviteStaff } from "@/actions/staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Loader2, 
  Mail, 
  User, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Send 
} from "lucide-react";

const initialState = {
  error: "",
  success: "",
};

export function InviteStaffForm() {
  const [state, formAction, pending] = useActionState(inviteStaff, initialState);

  return (
    <Card className="border-sidebar-border/50 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/10 border-b border-sidebar-border/30 pb-4">
        <CardTitle className="text-lg">Staff Details</CardTitle>
        <CardDescription>
          They will use these credentials to access the admin dashboard.
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-5 pt-6">
          {/* Name Input */}
          <div className="space-y-2 group">
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                id="name" 
                name="name" 
                placeholder="Amy Chen" 
                required
                className="pl-10 " 
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2 group">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="amy@nexpetcare.com" 
                required
                className="pl-10 " 
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2 group">
            <Label htmlFor="password" className="text-sm font-medium">Temporary Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                id="password" 
                name="password" 
                type="text" 
                placeholder="e.g., SecurePass123!" 
                required
                className="pl-10 " 
              />
            </div>
            <p className="text-[13px] text-muted-foreground">
              They will be required to change this upon their first login.
            </p>
          </div>

          {/* Interactive Feedback Banners */}
          {state?.error && (
            <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="size-4 shrink-0" />
              <p className="font-medium">{state.error}</p>
            </div>
          )}
          {state?.success && (
            <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-600 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <p className="font-medium">{state.success}</p>
            </div>
          )}
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="border-t border-sidebar-border/30 bg-muted/10 px-6 py-4">
          <Button 
            type="submit" 
            disabled={pending} 
            className="w-full sm:w-auto ml-auto group relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <Send className="mr-2 size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                Send Invitation
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}