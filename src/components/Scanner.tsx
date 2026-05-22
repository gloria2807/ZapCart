import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "../store/useCartStore";

export default function Scanner() {
  const scanBarcode = useCartStore((state) => state.scanBarcode);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const lastScanRef = useRef({ code: "", time: 0 });

  const [flash, setFlash] = useState(false);

  // 🔊 Beep sound
  const beep = () => {
    const audio = new Audio("/beep.mp3"); // place file in /public
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 220, height: 140 },
        aspectRatio: 1.5,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText: string) => {
        const now = Date.now();
        const lastScan = lastScanRef.current;

        if (lastScan.code === decodedText && now - lastScan.time < 2000) return;

        lastScanRef.current = { code: decodedText, time: now };

        // ✅ Trigger feedback
        setFlash(true);
        beep();

        setTimeout(() => setFlash(false), 300);

        scanBarcode(decodedText);
      },
      () => {}
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => console.error(err));
      }
    };
  }, [scanBarcode]);

  return (
    <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
      
      {/* Header */}
      <div className="px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold">
        Scan Product
      </div>

      {/* Scanner Area */}
      <div className="relative flex-1 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
        
        {/* Scanner Feed */}
        <div className="w-full max-w-xl mx-auto">
  <div id="reader" className="w-full h-55 md:h-65 lg:h-75 overflow-hidden rounded-lg"></div>
</div>

        {/* Overlay Frame */}
        <div
  className={`absolute w-40 h-24 sm:w-52 sm:h-32 md:w-56 md:h-36 rounded-lg pointer-events-none border-2 transition-all duration-200 ${
    flash ? "border-green-400 scale-105" : "border-indigo-500"
  }`}
>
          <div className="absolute inset-0 border-2 border-dashed border-purple-400 opacity-60 rounded-lg"></div>
        </div>

        {/* Instruction */}
        <p className="absolute bottom-2 text-xs text-zinc-600 dark:text-zinc-300">
          Align barcode within frame
        </p>
      </div>
    </div>
  );
}