import type { Metadata, Viewport } from "next";
import { AddToHomeScreen } from "@/components/AddToHomeScreen";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "NexPetCare | Booking Engine",
  description: "Automated pet care scheduling systems",
  manifest: "/manifest.json",
  icons: {
    apple: "/logohome.jpg", 
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NexPetCare",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body suppressHydrationWarning className="h-full bg-white text-gray-900">
        
        {/* Navbar and Footer REMOVED from here. They are now in the individual pages. */}
        {children}

        <AddToHomeScreen logo="/logohome.jpg" />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}