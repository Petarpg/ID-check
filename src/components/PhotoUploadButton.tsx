import { useState, useRef, useEffect } from "react";
import {
  CameraIcon,
  PhotoIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface PhotoUploadButtonProps {
  label: string;
  category: string;
  onPhotoUpload: (category: string, photoUrl: string) => void;
  currentPhoto?: string;
}

export default function PhotoUploadButton({
  label,
  category,
  onPhotoUpload,
  currentPhoto,
}: PhotoUploadButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoUpload(category, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open camera modal
  const startCamera = () => {
    setShowCamera(true);
  };

  // Clean up camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  // Camera stream lifecycle
  useEffect(() => {
    if (!showCamera) return;
    let active = true;
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }
    enableCamera();
    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [showCamera, facingMode]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(videoRef.current, 0, 0);

      const photoUrl = canvas.toDataURL("image/jpeg");
      onPhotoUpload(category, photoUrl);
      stopCamera();
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 text-left text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
        >
          {label}
        </button>

        {showOptions && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors duration-200">
              <PhotoIcon
                className="mr-3 h-5 w-5 text-blue-500"
                aria-hidden="true"
              />
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
            <button
              onClick={startCamera}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <CameraIcon
                className="mr-3 h-5 w-5 text-blue-500"
                aria-hidden="true"
              />
              Take Photo
            </button>
          </div>
        )}
      </div>

      {currentPhoto && (
        <div className="p-4 pt-0">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
            <img
              src={currentPhoto}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="w-full h-full max-w-none max-h-none rounded-none p-0 m-0 flex flex-col items-center justify-center sm:bg-white sm:rounded-lg sm:p-6 sm:max-w-2xl sm:h-auto sm:mx-4 sm:bg-opacity-100 bg-transparent overflow-hidden">
            <div className="relative w-full h-full flex-1 flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Overlay controls */}
              <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 z-10">
                <h3 className="text-lg font-medium text-white drop-shadow sm:text-black">
                  Take Photo
                </h3>
                <button
                  onClick={stopCamera}
                  className="text-white hover:text-gray-200 sm:text-gray-500 sm:hover:text-gray-700 bg-black/30 sm:bg-transparent rounded-full p-1"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <button
                onClick={handleSwitchCamera}
                className="absolute top-4 right-16 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition-colors z-10"
                title="Switch Camera"
                type="button"
              >
                <ArrowPathIcon className="h-6 w-6 text-gray-700" />
              </button>
              <div className="absolute bottom-0 left-0 w-full flex justify-center p-4 z-10 bg-gradient-to-t from-black/60 to-transparent">
                <button
                  onClick={capturePhoto}
                  className="bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-200 w-full max-w-xs text-lg shadow-lg"
                >
                  Capture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
