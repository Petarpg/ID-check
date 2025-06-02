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
              onClick={handleCameraCapture}
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
    </div>
  );
}
