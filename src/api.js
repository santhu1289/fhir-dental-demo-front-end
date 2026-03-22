export async function saveCondition(data) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/save-condition`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  return await response.json();
}