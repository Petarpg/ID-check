"use client";

import { useState, useRef, useEffect } from "react";
import SiteSelector from "@/components/SiteSelector";
import PhotoUploadButton from "@/components/PhotoUploadButton";
import LicensePlateReader from "@/components/LicensePlateReader";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import InspectionReportForm from "@/components/InspectionReportForm";
import html2canvas from "html2canvas";

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

// Add the initial state and handlers for the form
const initialFormState = {
  plantName: "",
  location: "",
  checkingCompany: "",
  supplier: "",
  deliverySlipNo: "",
  logisticCompany: "",
  containerNo: "",
  licensePlateTruck: "",
  licensePlateTrailer: "",
  weather: "",
  visualChecks: [false, false, false, false, false, false, false],
  comments: "",
  inspectorName: "",
  date: "",
};

export default function Home() {
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [sitePhotos, setSitePhotos] = useState<SitePhotos>({});
  const [plateNumbers, setPlateNumbers] = useState<SitePlateNumbers>({});
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState(initialFormState);

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

  // Handlers for form fields
  const handleFormInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormCheck = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      visualChecks: prev.visualChecks.map((v, i) => (i === idx ? !v : v)),
    }));
  };

  // Set today's date in YYYY-MM-DD format if empty
  useEffect(() => {
    if (!form.date) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const formatted = `${yyyy}-${mm}-${dd}`;
      setForm((prev) => ({ ...prev, date: formatted }));
    }
  }, []);

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
      {/* Inspection Report Form */}
      <div ref={formRef}>
        <InspectionReportForm
          form={form}
          setForm={setForm}
          handleFormInput={handleFormInput}
          handleFormCheck={handleFormCheck}
          recognizedTruckPlate={getCurrentPlateNumbers()["truck"]}
          recognizedTrailerPlate={getCurrentPlateNumbers()["trailer"]}
          truckPhoto={getCurrentPhotos()["truck"]}
          trailerPhoto={getCurrentPhotos()["trailer"]}
          damagedPhoto={getCurrentPhotos()["damaged"]}
        />
      </div>
      {/* Export Buttons Section (centered below the form) */}
      <div className="max-w-4xl mx-auto mt-8 mb-8 p-6 bg-white rounded-xl shadow-lg flex justify-center gap-4">
        <button
          onClick={() => {
            // Export all form fields and the visual checks table
            const data = [
              { Field: "PV-Plant Name/Location", Value: form.plantName },
              { Field: "Checking Company", Value: form.checkingCompany },
              { Field: "Supplier", Value: form.supplier },
              { Field: "Delivery Slip No.", Value: form.deliverySlipNo },
              { Field: "Logistic Company", Value: form.logisticCompany },
              { Field: "Container No.", Value: form.containerNo },
              { Field: "Licence plate truck", Value: form.licensePlateTruck },
              {
                Field: "Licence plate trailer",
                Value: form.licensePlateTrailer,
              },
              { Field: "Weather", Value: form.weather },
              { Field: "Inspector Name", Value: form.inspectorName },
              { Field: "Date/Signature", Value: form.date },
              { Field: "Comments", Value: form.comments },
            ];
            // Visual checks table
            data.push({ Field: "", Value: "" });
            data.push({ Field: "Visual checks of delivery", Value: "" });
            data.push({
              Field: "No.",
              Value: "Description | OK | N/A | Comment",
            });
            const visualChecksDescriptions = [
              "Load properly secured",
              "Delivery without damages",
              "Packaging sufficient and stable enough",
              "Goods according to delivery slip and PO, amount and identity",
              "Suitable machines for unloading/handling present",
              "Delivery slip scanned, uploaded and filed",
              "Inspection Report scanned, uploaded and filed",
            ];
            for (let i = 0; i < visualChecksDescriptions.length; i++) {
              data.push({
                Field: `${i + 1}`,
                Value: `${visualChecksDescriptions[i]} | ${
                  form.visualChecks[i] ? "OK" : ""
                } |  | ${(form as any)[`comment${i}`] || ""}`,
              });
            }
            // Images (as base64 or note if not present)
            const photos = getCurrentPhotos();
            data.push({
              Field: "Truck Plate Photo",
              Value: photos["truck"] ? "[Image attached]" : "",
            });
            data.push({
              Field: "Trailer Plate Photo",
              Value: photos["trailer"] ? "[Image attached]" : "",
            });
            data.push({
              Field: "Loading/Damages Photo",
              Value: photos["damaged"] ? "[Image attached]" : "",
            });
            // Optionally, include the base64 string (uncomment if needed)
            // data.push({ Field: "Truck Plate Photo (base64)", Value: photos["truck"] || "" });
            // data.push({ Field: "Trailer Plate Photo (base64)", Value: photos["trailer"] || "" });
            // data.push({ Field: "Loading/Damages Photo (base64)", Value: photos["damaged"] || "" });
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Inspection Report");
            XLSX.writeFile(wb, "inspection-report.xlsx");
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Export to Excel
        </button>
        <button
          onClick={async () => {
            if (formRef.current) {
              const canvas = await html2canvas(formRef.current);
              const imgData = canvas.toDataURL("image/png");
              const pdf = new jsPDF({
                orientation: "portrait",
                unit: "pt",
                format: "a4",
              });
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              // Scale image to fit page
              const imgWidth = pageWidth - 40;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
              pdf.save("inspection-report.pdf");
            }
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Export to PDF
        </button>
      </div>
    </main>
  );
}
