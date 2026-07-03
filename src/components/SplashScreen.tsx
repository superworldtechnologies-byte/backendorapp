// components/SplashScreen.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Show the splash screen for 1.2 seconds, then fade it out
    const timer = setTimeout(() => setFade(true), 1200);
    const removeTimer = setTimeout(() => setShow(false), 1700); // 500ms for fade out
    
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${fade ? 'opacity-0' : 'opacity-100'}`}
    >
      <Image 
        src="/logohome.jpg" 
        alt="NexPetCare Loading" 
        width={180} 
        height={180} 
        className="animate-pulse rounded-3xl shadow-lg"
        priority
      />
    </div>
  );
}