const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://fhir-dental-demo-backend.vercel.app";

export async function saveCondition(data) {
  console.log("Using API:", BASE_URL);

  const response = await fetch(`${BASE_URL}/save-condition`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}