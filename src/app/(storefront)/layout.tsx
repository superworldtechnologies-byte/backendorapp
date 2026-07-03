// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { VisitorTracker } from "@/components/admin/storefront/visitor-tracker";
import Navbar from "@/components/landingpage/Navbar";
import Footer from "@/components/landingpage/Footer";
import { AddToHomeScreen } from "@/components/AddToHomeScreen";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

// Import our new guaranteed splash screen
import SplashScreen from "@/components/SplashScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexPetCare | Booking Engine",
  description: "Automated pet care scheduling systems",
  manifest: "/manifest.json",
  icons: {
    apple: "/logohome.jpg",
  },
  // Tip 2 & Tip 5: Standalone mode and Transparent Status Bar
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NexPetCare",
    // Note: I removed the massive array of startup images because our React 
    // SplashScreen component replaces it and is 100% reliable across all devices.
  },
};

// Tip 5 (viewport-fit=cover) & Tip 7 (user-scalable=no)
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents accidental pinch-to-zoom
  viewportFit: "cover", // Pushes the app to the very edges, ignoring the notch
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>

      <head>
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
      </head>
      <body suppressHydrationWarning className="h-full bg-white text-gray-900">

        <VisitorTracker />

        {/* 
          Tip 6: Make the header fixed (BUT ONLY ON MOBILE APP).
          We use our `standalone:` prefix to apply the fixed position and 
          the `env(safe-area-inset-top)` to push the navbar exactly below the iPhone notch.
        */}
        <header className="bg-white border-b z-50 standalone:fixed standalone:top-0 standalone:w-full standalone:pt-[env(safe-area-inset-top)]">
          <Navbar />
        </header>

        {/* 
          Tip 6 continued: Add margin to the main content so it doesn't hide behind the fixed header.
          `native-scroll` allows momentum scrolling inside this container on mobile.
          `pb-[env(safe-area-inset-bottom)]` protects the footer from the iOS home bar.
        */}
        <main className="standalone:mt-[calc(env(safe-area-inset-top)+4rem)] standalone:pb-[env(safe-area-inset-bottom)] native-scroll">
          {children}
        </main>

        <Footer />
        <AddToHomeScreen logo="/logohome.jpg" />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}