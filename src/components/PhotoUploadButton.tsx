import { useState, useRef, useEffect } from "react";
import { CameraIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
          video: true,
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
  }, [showCamera]);

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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Take Photo</h3>
              <button
                onClick={stopCamera}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={capturePhoto}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Capture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
