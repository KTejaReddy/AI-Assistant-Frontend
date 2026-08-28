const API_BASE = "http://localhost:3001/api";

export async function analyzeScreen(imageBlob) {
  const formData = new FormData();
  formData.append("image", imageBlob, "screenshot.jpg");

  const response = await fetch(`${API_BASE}/vision`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Vision API failed");
  return await response.json();
}

export async function getReasoning(voiceText, screenDescription) {
  const response = await fetch(`${API_BASE}/reason`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voice: voiceText, description: screenDescription }),
  });

  if (!response.ok) throw new Error("Reasoning API failed");
  return await response.json();
}
