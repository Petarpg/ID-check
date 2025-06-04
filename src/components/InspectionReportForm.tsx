import React, { useEffect } from "react";

interface InspectionReportFormProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  handleFormInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleFormCheck: (idx: number) => void;
  recognizedTruckPlate?: string;
  recognizedTrailerPlate?: string;
  truckPhoto?: string;
  trailerPhoto?: string;
  damagedPhoto?: string;
}

export default function InspectionReportForm({
  form,
  setForm,
  handleFormInput,
  handleFormCheck,
  recognizedTruckPlate,
  recognizedTrailerPlate,
  truckPhoto,
  trailerPhoto,
  damagedPhoto,
}: InspectionReportFormProps) {
  useEffect(() => {
    setForm((prev: any) => ({
      ...prev,
      licensePlateTruck: recognizedTruckPlate || prev.licensePlateTruck,
      licensePlateTrailer: recognizedTrailerPlate || prev.licensePlateTrailer,
    }));
  }, [recognizedTruckPlate, recognizedTrailerPlate, setForm]);

  // Set today's date in YYYY-MM-DD format if empty
  useEffect(() => {
    setForm((prev: any) => {
      if (!prev.date) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const formatted = `${yyyy}-${mm}-${dd}`;
        return { ...prev, date: formatted };
      }
      return prev;
    });
  }, [setForm]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev: any) => ({ ...prev, [key]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto mt-8 border border-blue-300">
      <h2 className="text-xl font-bold text-center mb-2 border-b pb-2">
        Inspection Report Substructure Delivery
      </h2>
      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
        <div>
          <label className="font-semibold">PV-Plant Name/Location:</label>
          <input
            name="plantName"
            value={form.plantName}
            onChange={handleFormInput}
            className="border rounded px-2 py-1 w-full mt-1"
          />
        </div>
        <div>
          <label className="font-semibold">Checking Company:</label>
          <input
            name="checkingCompany"
            value={form.checkingCompany}
            onChange={handleFormInput}
            className="border rounded px-2 py-1 w-full mt-1"
          />
        </div>
      </div>
      <div className="flex justify-end mb-2">
        <img
          src="/goldbecksolar-logo.png"
          alt="goldbecksolar"
          className="h-8"
        />
      </div>
      <h3 className="font-semibold text-base mt-2 mb-1">Delivery Details</h3>
      <table className="w-full text-xs border mb-2">
        <thead>
          <tr className="bg-blue-100">
            <th className="border px-2 py-1 text-left">Field</th>
            <th className="border px-2 py-1 text-left">Value</th>
            <th className="border px-2 py-1 text-left">Item:</th>
            <th className="border px-2 py-1 text-left">Amount:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1 font-semibold">Supplier:</td>
            <td className="border px-2 py-1">
              <input
                name="supplier"
                value={form.supplier}
                onChange={handleFormInput}
                className="w-full"
              />
            </td>
            <td className="border px-2 py-1">
              <input
                name="item1"
                value={form.item1 || ""}
                onChange={handleFormInput}
                className="w-full"
                placeholder="Item 1"
              />
            </td>
            <td className="border px-2 py-1">
              <input
                name="amount1"
                value={form.amount1 || ""}
                onChange={handleFormInput}
                className="w-full"
                placeholder="Amount 1"
              />
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">
              Delivery Slip No.:
            </td>
            <td className="border px-2 py-1">
              <input
                name="deliverySlipNo"
                value={form.deliverySlipNo}
                onChange={handleFormInput}
                className="w-full"
              />
            </td>
            <td className="border px-2 py-1">
              <input
                name="item2"
                value={form.item2 || ""}
                onChange={handleFormInput}
                className="w-full"
                placeholder="Item 2"
              />
            </td>
            <td className="border px-2 py-1">
              <input
                name="amount2"
                value={form.amount2 || ""}
                onChange={handleFormInput}
                className="w-full"
                placeholder="Amount 2"
              />
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">Logistic Comp.:</td>
            <td className="border px-2 py-1">
              <input
                name="logisticCompany"
                value={form.logisticCompany}
                onChange={handleFormInput}
                className="w-full"
              />
            </td>
            <td className="border px-2 py-1"></td>
            <td className="border px-2 py-1"></td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">Container No.:</td>
            <td className="border px-2 py-1">
              <input
                name="containerNo"
                value={form.containerNo}
                onChange={handleFormInput}
                className="w-full"
              />
            </td>
            <td className="border px-2 py-1"></td>
            <td className="border px-2 py-1"></td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">
              Licence plate truck:
            </td>
            <td className="border px-2 py-1">
              <input
                name="licensePlateTruck"
                value={form.licensePlateTruck}
                onChange={handleFormInput}
                className="w-full"
              />
            </td>
            <td className="border px-2 py-1"></td>
            <td className="border px-2 py-1"></td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">
              Licence plate trailer:
            </td>
            <td className="border px-2 py-1">
              <input
                name="licensePlateTrailer"
                value={form.licensePlateTrailer}
                onChange={handleFormInput}
                className="w-full"
              />
            </td>
            <td className="border px-2 py-1"></td>
            <td className="border px-2 py-1"></td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">Weather:</td>
            <td className="border px-2 py-1">
              <input
                name="weather"
                value={form.weather}
                onChange={handleFormInput}
                className="w-full"
              />
            </td>
            <td className="border px-2 py-1"></td>
            <td className="border px-2 py-1"></td>
          </tr>
        </tbody>
      </table>
      {/* Show Document image below the table if present */}
      {damagedPhoto && (
        <div className="mt-4">
          <div className="font-semibold mb-1">Document Image:</div>
          <img
            src={damagedPhoto}
            alt="Document"
            className="w-64 h-auto border rounded shadow"
          />
        </div>
      )}
      <h3 className="font-semibold text-base mt-2 mb-1">
        Visual checks of delivery
      </h3>
      <table className="w-full text-xs border mb-2">
        <thead>
          <tr className="bg-blue-100">
            <th className="border px-2 py-1">No.</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">ok</th>
            <th className="border px-2 py-1">N/A</th>
            <th className="border px-2 py-1">Comment</th>
          </tr>
        </thead>
        <tbody>
          {[
            "Load properly secured",
            "Delivery without damages",
            "Packaging sufficient and stable enough",
            "Goods according to delivery slip and PO, amount and identity",
            "Suitable machines for unloading/handling present",
            "Delivery slip scanned, uploaded and filed",
            "Inspection Report scanned, uploaded and filed",
          ].map((desc, i) => (
            <tr key={i}>
              <td className="border px-2 py-1 text-center">{i + 1}</td>
              <td className="border px-2 py-1">{desc}</td>
              <td className="border px-2 py-1 text-center">
                <input
                  type="checkbox"
                  checked={form.visualChecks[i]}
                  onChange={() => handleFormCheck(i)}
                />
              </td>
              <td className="border px-2 py-1 text-center">
                <input type="checkbox" disabled />
              </td>
              <td className="border px-2 py-1">
                <input
                  name={`comment${i}`}
                  value={form[`comment${i}`] || ""}
                  onChange={handleFormInput}
                  className="w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-2">
        <label className="font-semibold">Comments</label>
        <textarea
          name="comments"
          value={form.comments}
          onChange={handleFormInput}
          className="border rounded px-2 py-1 w-full mt-1"
          rows={2}
        />
      </div>
      <h3 className="font-semibold text-base mt-2 mb-1">
        Pictures with license plate of the truck / container No. / loading /
        damages etc.
      </h3>
      <div className="flex flex-wrap gap-4 mb-4">
        {truckPhoto && (
          <img
            src={truckPhoto}
            alt="Truck Plate"
            className="mt-1 w-40 h-20 object-contain border"
          />
        )}
        {trailerPhoto && (
          <img
            src={trailerPhoto}
            alt="Trailer Plate"
            className="mt-1 w-40 h-20 object-contain border"
          />
        )}
        {damagedPhoto && (
          <img
            src={damagedPhoto}
            alt="Loading/Damages"
            className="mt-1 w-40 h-20 object-contain border"
          />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="font-semibold">Printed Name:</label>
          <input
            name="inspectorName"
            value={form.inspectorName}
            onChange={handleFormInput}
            className="border rounded px-2 py-1 w-full mt-1"
          />
        </div>
        <div>
          <label className="font-semibold">Date/Signature:</label>
          <input
            name="date"
            value={form.date}
            onChange={handleFormInput}
            className="border rounded px-2 py-1 w-full mt-1"
            type="date"
          />
        </div>
      </div>
    </section>
  );
}
