"use client";

import { useState } from "react";
import SiteSelector from "@/components/SiteSelector";
import PhotoUploadButton from "@/components/PhotoUploadButton";

const sites = [
  { id: "london", name: "London" },
  { id: "helsinki", name: "Helsinki" },
];

export default function Home() {
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [photos, setPhotos] = useState<Record<string, string>>({});

  const handlePhotoUpload = (category: string, photoUrl: string) => {
    setPhotos((prev) => ({
      ...prev,
      [category]: photoUrl,
    }));
  };

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      <div className="mb-6">
        <SiteSelector
          sites={sites}
          selectedSite={selectedSite}
          onSiteChange={setSelectedSite}
        />
      </div>

      <div className="space-y-4">
        <PhotoUploadButton
          label="Truck License Plate"
          category="truck"
          onPhotoUpload={handlePhotoUpload}
          currentPhoto={photos["truck"]}
        />
        <PhotoUploadButton
          label="Trailer License Plate"
          category="trailer"
          onPhotoUpload={handlePhotoUpload}
          currentPhoto={photos["trailer"]}
        />
        <PhotoUploadButton
          label="Damaged Goods"
          category="damaged"
          onPhotoUpload={handlePhotoUpload}
          currentPhoto={photos["damaged"]}
        />
        <PhotoUploadButton
          label="Document"
          category="document"
          onPhotoUpload={handlePhotoUpload}
          currentPhoto={photos["document"]}
        />
      </div>
    </main>
  );
}
