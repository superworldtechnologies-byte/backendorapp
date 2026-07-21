import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BookingSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold">Booking confirmed</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your booking has been created successfully.
      </p>

      <div className="mt-6 flex justify-center gap-3">
        <Button asChild>
          <Link href="./websitetwo/services">Book another service</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}