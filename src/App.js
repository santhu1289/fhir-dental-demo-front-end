import React, { useState } from "react";
import DentalChart from "./DentalChart";
import { CONDITION_CODES } from "./fhirCodes";
import { Button } from "./components/ui/button";

function App() {

  const [selectedTooth, setSelectedTooth] = useState(null);
  const [toothStatus, setToothStatus] = useState({});
  const [condition, setCondition] = useState("");
  const [fhirResponse, setFhirResponse] = useState(null);
  const [hoveredTooth, setHoveredTooth] = useState(null);

  // ✅ UPDATED (single source of truth)
  const handleToothSelect = (tooth, condition) => {
    setSelectedTooth(tooth);
    setCondition(condition);
  };

  // ✅ RESET EVERYTHING
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
      const response = await fetch("http://localhost:4000/save-condition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      setFhirResponse(result);

      alert("FHIR Condition Resource Created");

    } catch (error) {
      console.error("FHIR Error:", error);
    }

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
  resetAllData={resetAllData}   // 🔥 ADD THIS
/>
      {selectedTooth && (
        <div style={{ marginTop: "30px" }}>

          <h3>Selected Tooth: {selectedTooth}</h3>

          {condition && (
            <div style={{
              background: "#eef6ff",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "10px"
            }}>
              👉 Tooth {selectedTooth} → {CONDITION_LABELS[condition]}
            </div>
          )}

          <Button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
            onClick={saveCondition}
          >
            Save
          </Button>

        </div>
      )}

      <div style={{ marginTop: "40px" }}>
        <h3>Dental History</h3>

        {Object.keys(toothStatus).map((tooth) => (
          <div key={tooth}>
            Tooth {tooth} → {CONDITION_LABELS[toothStatus[tooth]]}
          </div>
        ))}
      </div>

      {fhirResponse && (
        <div style={{ marginTop: "40px" }}>
          <h3>FHIR Server Response</h3>
          <pre style={{ background: "#f4f4f4", padding: "15px" }}>
            {JSON.stringify(fhirResponse, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
}

export default App;