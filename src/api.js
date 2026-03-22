export async function saveCondition(data) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!BASE_URL) {
    throw new Error("API URL is missing 🚨");
  }

  const response = await fetch(`${BASE_URL}/save-condition`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}