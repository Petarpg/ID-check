"use client";

import { useState } from "react";
import SiteSelector from "@/components/SiteSelector";
import PhotoUploadButton from "@/components/PhotoUploadButton";
import LicensePlateReader from "@/components/LicensePlateReader";

const sites = [
  { id: "london", name: "London" },
  { id: "helsinki", name: "Helsinki" },
];

interface SitePhotos {
  [siteId: string]: {
    [category: string]: string;
  };
}

interface SitePlateNumbers {
  [siteId: string]: {
    [category: string]: string;
  };
}

export default function Home() {
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [sitePhotos, setSitePhotos] = useState<SitePhotos>({});
  const [plateNumbers, setPlateNumbers] = useState<SitePlateNumbers>({});

  const handlePhotoUpload = (category: string, photoUrl: string) => {
    setSitePhotos((prev) => ({
      ...prev,
      [selectedSite.id]: {
        ...prev[selectedSite.id],
        [category]: photoUrl,
      },
    }));
  };

  const handlePlateDetected = (category: string, plateNumber: string) => {
    setPlateNumbers((prev) => ({
      ...prev,
      [selectedSite.id]: {
        ...prev[selectedSite.id],
        [category]: plateNumber,
      },
    }));
  };

  const getCurrentPhotos = () => {
    return sitePhotos[selectedSite.id] || {};
  };

  const getCurrentPlateNumbers = () => {
    return plateNumbers[selectedSite.id] || {};
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

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Truck Information
            </h2>
            <PhotoUploadButton
              label="Truck License Plate"
              category="truck"
              onPhotoUpload={handlePhotoUpload}
              currentPhoto={getCurrentPhotos()["truck"]}
            />
            {getCurrentPhotos()["truck"] && (
              <LicensePlateReader
                imageUrl={getCurrentPhotos()["truck"]}
                onPlateDetected={(plateNumber) =>
                  handlePlateDetected("truck", plateNumber)
                }
              />
            )}
            {getCurrentPlateNumbers()["truck"] && (
              <p className="mt-2 text-sm text-gray-600">
                Detected Plate: {getCurrentPlateNumbers()["truck"]}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Trailer Information
            </h2>
            <PhotoUploadButton
              label="Trailer License Plate"
              category="trailer"
              onPhotoUpload={handlePhotoUpload}
              currentPhoto={getCurrentPhotos()["trailer"]}
            />
            {getCurrentPhotos()["trailer"] && (
              <LicensePlateReader
                imageUrl={getCurrentPhotos()["trailer"]}
                onPlateDetected={(plateNumber) =>
                  handlePlateDetected("trailer", plateNumber)
                }
              />
            )}
            {getCurrentPlateNumbers()["trailer"] && (
              <p className="mt-2 text-sm text-gray-600">
                Detected Plate: {getCurrentPlateNumbers()["trailer"]}
              </p>
            )}
          </div>

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
      {/* License Plate Storage Section */}
      <div className="max-w-4xl mx-auto mt-8 mb-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Stored License Plate Numbers
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-gray-600 text-sm mb-1">
              Truck License Plate
            </div>
            <div className="text-lg font-mono text-gray-900">
              {getCurrentPlateNumbers()["truck"] || (
                <span className="text-gray-400">Not detected yet</span>
              )}
            </div>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-gray-600 text-sm mb-1">
              Trailer License Plate
            </div>
            <div className="text-lg font-mono text-gray-900">
              {getCurrentPlateNumbers()["trailer"] || (
                <span className="text-gray-400">Not detected yet</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
