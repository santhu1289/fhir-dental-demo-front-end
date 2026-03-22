import React, { useState } from "react";
import DentalChart from "./DentalChart";
import { CONDITION_CODES } from "./fhirCodes";
import { Button } from "./components/ui/button";
import { saveCondition as saveConditionAPI } from "./api"; // ✅ using api.js

function App() {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [toothStatus, setToothStatus] = useState({});
  const [condition, setCondition] = useState("");
  const [fhirResponse, setFhirResponse] = useState(null);
  const [hoveredTooth, setHoveredTooth] = useState(null);
  const [loading, setLoading] = useState(false); // 🔥 better UX

  // ✅ Tooth select handler
  const handleToothSelect = (tooth, condition) => {
    setSelectedTooth(tooth);
    setCondition(condition);
  };

  // ✅ Reset everything
  const resetAllData = () => {
    setSelectedTooth(null);
    setCondition("");
    setToothStatus({});
    setHoveredTooth(null);
    setFhirResponse(null);
  };

  // ✅ Save condition (API integrated properly)
  const saveCondition = async () => {
    if (!selectedTooth || !condition) {
      alert("Select tooth and condition");
      return;
    }

    setLoading(true);

    // update UI immediately
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
      const result = await saveConditionAPI(payload); // ✅ backend call

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
    <div style={{ padding: "40px", fontFamily: "Arial" }}>

      <h2>Dental OP Form Demo</h2>

      <DentalChart
        onSelectTooth={handleToothSelect}
        status={toothStatus}
        hoveredTooth={hoveredTooth}
        setHoveredTooth={setHoveredTooth}
        setCondition={setCondition}
        resetAllData={resetAllData}
      />

      {selectedTooth && (
        <div style={{ marginTop: "30px" }}>

          <h3>Selected Tooth: {selectedTooth}</h3>

          {condition && (
            <div
              style={{
                background: "#eef6ff",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "10px"
              }}
            >
              👉 Tooth {selectedTooth} → {CONDITION_LABELS[condition]}
            </div>
          )}

          <Button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
            onClick={saveCondition}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>

        </div>
      )}

      <div style={{ marginTop: "40px" }}>
        <h3>Dental History</h3>

        {Object.keys(toothStatus).length === 0 && (
          <p>No records yet 🦷</p>
        )}

        {Object.keys(toothStatus).map((tooth) => (
          <div key={tooth}>
            Tooth {tooth} → {CONDITION_LABELS[toothStatus[tooth]]}
          </div>
        ))}
      </div>

      {fhirResponse && (
        <div style={{ marginTop: "40px" }}>
          <h3>FHIR Server Response</h3>
          <pre
            style={{
              background: "#f4f4f4",
              padding: "15px",
              borderRadius: "6px",
              overflowX: "auto"
            }}
          >
            {JSON.stringify(fhirResponse, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
}

export default App;