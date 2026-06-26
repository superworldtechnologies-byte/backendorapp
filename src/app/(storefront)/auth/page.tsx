import { PhoneAuthForm } from "@/components/storefront/phone-auth-form";

export default function CustomerAuthPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold ">
            Continue to booking
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your phone number or create a new customer account.
          </p>
        </div>

        <PhoneAuthForm />
      </div>
    </div>
  );
}