import React, { useState } from "react";
import DentalChart from "./DentalChart";
import { CONDITION_CODES } from "./fhirCodes";
import { Button } from "./components/ui/button";
import { saveCondition as saveConditionAPI } from "./api";

function App() {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [toothStatus, setToothStatus] = useState({});
  const [condition, setCondition] = useState("");
  const [fhirResponse, setFhirResponse] = useState(null);
  const [hoveredTooth, setHoveredTooth] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleToothSelect = (tooth, condition) => {
    setSelectedTooth(tooth);
    setCondition(condition);
  };

  const resetAllData = () => {
    setSelectedTooth(null);
    setCondition("");
    setToothStatus({});
    setHoveredTooth(null);
    setFhirResponse(null);
  };

  const saveCondition = async () => {
    if (!selectedTooth || !condition) {
      alert("Select tooth and condition");
      return;
    }

    setLoading(true);

    setToothStatus((prev) => ({
      ...prev,
      [selectedTooth]: condition
    }));

    const codeData = CONDITION_CODES[condition];

    const payload = {
      patientId: "131373233",
      tooth: selectedTooth,
      code: codeData.code,
      display: codeData.display
    };

    try {
      const result = await saveConditionAPI(payload);
      setFhirResponse(result);
      alert("FHIR Condition Resource Created ✅");
    } catch (error) {
      console.error("FHIR Error:", error);
      alert("Something went wrong ❌");
    }

    setLoading(false);
    setCondition("");
    setSelectedTooth(null);
    setHoveredTooth(null);
  };

  const CONDITION_LABELS = {
    caries: "Dental Caries",
    infection: "Infection",
    extracted: "Extracted",
    filling: "Filling"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h2 className="text-xl md:text-3xl font-bold mb-6 text-center">
          Dental OP Form Demo
        </h2>

        {/* Dental Chart (scrollable on mobile) */}
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow">
          <DentalChart
            onSelectTooth={handleToothSelect}
            status={toothStatus}
            hoveredTooth={hoveredTooth}
            setHoveredTooth={setHoveredTooth}
            setCondition={setCondition}
            resetAllData={resetAllData}
          />
        </div>

        {/* Selected Tooth Section */}
        {selectedTooth && (
          <div className="mt-6 bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-2">
              Selected Tooth: {selectedTooth}
            </h3>

            {condition && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded mb-3">
                👉 Tooth {selectedTooth} → {CONDITION_LABELS[condition]}
              </div>
            )}

            <Button
              className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700"
              onClick={saveCondition}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        )}

        {/* Dental History */}
        <div className="mt-6 bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">
            Dental History
          </h3>

          {Object.keys(toothStatus).length === 0 ? (
            <p className="text-gray-500">No records yet 🦷</p>
          ) : (
            <div className="space-y-1">
              {Object.keys(toothStatus).map((tooth) => (
                <div key={tooth} className="text-sm">
                  Tooth {tooth} → {CONDITION_LABELS[toothStatus[tooth]]}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FHIR Response */}
        {fhirResponse && (
          <div className="mt-6 bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-3">
              FHIR Server Response
            </h3>

            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
              {JSON.stringify(fhirResponse, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;