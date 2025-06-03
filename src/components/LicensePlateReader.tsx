import { useState } from "react";
import { createWorker, PSM } from "tesseract.js";

interface LicensePlateReaderProps {
  imageUrl: string;
  onPlateDetected: (plateNumber: string) => void;
}

export default function LicensePlateReader({
  imageUrl,
  onPlateDetected,
}: LicensePlateReaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = async () => {
    if (!imageUrl) return;

    setIsProcessing(true);
    setError(null);

    try {
      const worker: any = await createWorker();

      const {
        data: { text },
      } = await worker.recognize(imageUrl, {
        lang: "eng",
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        tessedit_pageseg_mode: PSM.SINGLE_LINE,
      });

      const cleanedText = text.replace(/[^A-Z0-9]/g, "").trim();

      if (cleanedText) {
        onPlateDetected(cleanedText);
      } else {
        setError("No license plate detected in the image");
      }

      await worker.terminate();
    } catch (err) {
      setError(
        "Error processing image: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={processImage}
        disabled={isProcessing || !imageUrl}
        className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
          isProcessing || !imageUrl
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isProcessing ? "Processing..." : "Read License Plate"}
      </button>

      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
}
