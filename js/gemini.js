export async function analyzeLostItem(name, description) {
  const API_KEY = "";

  const prompt = `
You are categorizing lost & found items on a college campus.

Choose ONLY ONE category from this list:
electronics, documents, accessories, clothing, stationery, others

Item name: ${name}
Description: ${description}

Return ONLY the category name. No extra text.
`;

 
  console.log("🧠 Gemini prompt:", prompt);

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  );

  const data = await response.json();

 

  console.log("📦 Gemini raw response:", data);

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text
      ?.toLowerCase()
      ?.trim() || "";

 

  console.log("🏷 Gemini extracted text:", text);

 

  if (text.includes("electronic")) return "electronics";
  if (text.includes("document")) return "documents";
  if (text.includes("accessor")) return "accessories";
  if (text.includes("cloth")) return "clothing";
  if (text.includes("stationery")) return "stationery";

  return "others";
}

