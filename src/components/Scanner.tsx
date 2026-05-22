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
    const audio = new Audio("/beep.mp3");
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

        // Flash feedback
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
    <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-200">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <h2 className="text-sm font-semibold text-black">
          Scan Product
        </h2>
      </div>

      {/* Scanner Area */}
      <div className="relative flex-1 flex items-center justify-center bg-white">
        
        {/* Scanner Feed */}
        <div className="w-full max-w-xl mx-auto px-3">
          <div
            id="reader"
            className="w-full h-55 md:h-65 lg:h-75 overflow-hidden rounded-xl"
          />
        </div>

        {/* Overlay Frame */}
        <div
          className={`absolute w-40 h-24 sm:w-52 sm:h-32 md:w-56 md:h-36 rounded-lg pointer-events-none border-2 transition-all duration-200 ${
            flash
              ? "border-black scale-105"
              : "border-gray-700"
          }`}
        >
          <div className="absolute inset-0 border-2 border-dashed border-gray-500 opacity-60 rounded-lg" />
        </div>

        {/* Instruction */}
        <p className="absolute bottom-3 text-xs text-gray-500">
          Align barcode within frame
        </p>
      </div>
    </div>
  );
}