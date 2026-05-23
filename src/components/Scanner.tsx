import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "../store/useCartStore";

export default function Scanner() {
  const scanBarcode = useCartStore((state) => state.scanBarcode);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  const lastScanRef = useRef({
    code: "",
    time: 0,
  });

  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        {
          facingMode: "environment", // BACK CAMERA
        },
        {
          fps: 10,
          qrbox: {
            width: 220,
            height: 140,
          },
          aspectRatio: 1.5,
        },
        (decodedText) => {
          const now = Date.now();
          const lastScan = lastScanRef.current;

          // Prevent duplicate scans
          if (
            lastScan.code === decodedText &&
            now - lastScan.time < 2000
          ) {
            return;
          }

          lastScanRef.current = {
            code: decodedText,
            time: now,
          };

          // Flash feedback
          setFlash(true);

          setTimeout(() => setFlash(false), 300);

          scanBarcode(decodedText);
        },
        () => {}
      )
      .catch((err) => {
        console.error("Scanner start failed:", err);
      });

    return () => {
      if (
        scannerRef.current &&
        scannerRef.current.isScanning
      ) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch((err) => console.error(err));
      }
    };
  }, [scanBarcode]);

  return (
    <div className="w-full flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-200">

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <h2 className="text-sm font-semibold text-black">
          Scan Product
        </h2>
      </div>

      {/* Scanner Area */}
      <div className="relative flex items-center justify-center bg-white p-3">

        {/* Scanner Feed */}
        <div className="w-full max-w-xl mx-auto">
          <div
            id="reader"
            className="w-full h-[320px] md:h-[380px] overflow-hidden rounded-xl"
          />
        </div>

        {/* Overlay */}
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
        <p className="absolute bottom-6 text-xs text-gray-500">
          Align barcode within frame
        </p>
      </div>
    </div>
  );
}