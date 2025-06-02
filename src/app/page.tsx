"use client";

import { useState } from "react";
import SiteSelector from "@/components/SiteSelector";
import PhotoUploadButton from "@/components/PhotoUploadButton";

const sites = [
  { id: "london", name: "London" },
  { id: "helsinki", name: "Helsinki" },
];

interface SitePhotos {
  [siteId: string]: {
    [category: string]: string;
  };
}

export default function Home() {
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [sitePhotos, setSitePhotos] = useState<SitePhotos>({});

  const handlePhotoUpload = (category: string, photoUrl: string) => {
    setSitePhotos((prev) => ({
      ...prev,
      [selectedSite.id]: {
        ...prev[selectedSite.id],
        [category]: photoUrl,
      },
    }));
  };

  const getCurrentPhotos = () => {
    return sitePhotos[selectedSite.id] || {};
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Material Delivery Tracking
          </h1>
          <div className="flex justify-end">
            <SiteSelector
              sites={sites}
              selectedSite={selectedSite}
              onSiteChange={setSelectedSite}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhotoUploadButton
            label="Truck License Plate"
            category="truck"
            onPhotoUpload={handlePhotoUpload}
            currentPhoto={getCurrentPhotos()["truck"]}
          />
          <PhotoUploadButton
            label="Trailer License Plate"
            category="trailer"
            onPhotoUpload={handlePhotoUpload}
            currentPhoto={getCurrentPhotos()["trailer"]}
          />
          <PhotoUploadButton
            label="Damaged Goods"
            category="damaged"
            onPhotoUpload={handlePhotoUpload}
            currentPhoto={getCurrentPhotos()["damaged"]}
          />
          <PhotoUploadButton
            label="Document"
            category="document"
            onPhotoUpload={handlePhotoUpload}
            currentPhoto={getCurrentPhotos()["document"]}
          />
        </div>
      </div>
    </main>
  );
}
