import { useState } from "react";
import { CameraIcon, PhotoIcon } from "@heroicons/react/24/outline";

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

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0);

      const photoUrl = canvas.toDataURL("image/jpeg");
      onPhotoUpload(category, photoUrl);

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="w-full bg-white px-4 py-3 text-left text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 rounded-lg"
      >
        {label}
      </button>

      {showOptions && (
        <div className="absolute z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
              <PhotoIcon
                className="mr-3 h-5 w-5 text-gray-400"
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
              onClick={handleCameraCapture}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <CameraIcon
                className="mr-3 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              Take Photo
            </button>
          </div>
        </div>
      )}

      {currentPhoto && (
        <div className="mt-2">
          <img
            src={currentPhoto}
            alt={label}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
