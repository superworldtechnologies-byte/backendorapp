'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

// Proper type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface Navigator {
    standalone?: boolean; // iOS Safari uses this
  }
  interface WindowEventMap {
    beforeinstallprompt: CustomEvent<BeforeInstallPromptEvent>;
  }
}

export function AddToHomeScreen({ logo }: { logo: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isStandalone, setIsStandalone] = useState<boolean | null>(null);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  // Detect if we're already running as a PWA
  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator).standalone === true;
    setIsStandalone(standalone);
  }, []);

  // Capture the install prompt from Android/Chrome
  useEffect(() => {
    if (isStandalone === true) return;

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault(); // Prevents the default browser banner
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
    };
  }, [isStandalone]);

  // Show custom dialog after 4 seconds (hidden on desktop via CSS)
  useEffect(() => {
    if (isStandalone === true || isStandalone === null) return;

    const timer = setTimeout(() => {
      setShowDialog(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isStandalone]);

  const handleAction = async () => {
    if (deferredPrompt) {
      // Android/Chrome – trigger native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowDialog(false);
      }
    } else {
      // iOS fallback – swap UI to show instructions inline instead of an alert
      setShowIosInstructions(true);
    }
  };

  // Don't render if not mounted, already installed, or hidden
  if (isStandalone === null || isStandalone === true || !showDialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 md:hidden bg-black/50 backdrop-blur-sm transition-all">
      <div className="w-full max-w-sm animate-in slide-in-from-bottom-10 duration-300">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="p-6 text-center">
            
            {/* Logo Wrapper */}
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-100">
              <Image
                src={logo}
                alt="App Icon"
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl object-cover"
              />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Add to Home Screen
            </h3>
            
            {/* Conditional Text vs Instructions */}
            {showIosInstructions ? (
              <div className="text-gray-600 text-sm leading-relaxed text-left bg-gray-50 p-4 rounded-xl mt-4">
                <p className="font-semibold mb-2 text-gray-900">How to install on iOS:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Tap the <strong>Share</strong> button at the bottom of your browser.</li>
                  <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> in the top right corner.</li>
                </ol>
              </div>
            ) : (
              <p className="text-gray-500 text-sm leading-relaxed">
                Get quick access and a full-screen experience — just like a native app!
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => setShowDialog(false)}
              className="py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
              {showIosInstructions ? 'Close' : 'Not now'}
            </button>
            
            {/* Hide the primary button if instructions are showing to force them to use the browser share button */}
            {!showIosInstructions && (
              <button
                onClick={handleAction}
                className="py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                {deferredPrompt ? 'Install App' : 'How to Add'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}