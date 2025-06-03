const API_TOKEN = "296da30d8436c346085124d432cea59a3c24ed7e";

function base64ToBlob(base64: string) {
  const parts = base64.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export async function recognizePlate(imageBase64: string): Promise<string[]> {
  const url = "https://api.platerecognizer.com/v1/plate-reader/";
  const blob = base64ToBlob(imageBase64);
  const formData = new FormData();
  formData.append("upload", blob, "plate.jpg");
  formData.append("regions", "us"); // For United States plates

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Token ${API_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Plate Recognizer API error: " + response.statusText);
  }

  const data = await response.json();
  if (data.results && data.results.length > 0) {
    return data.results.map((r: any) => r.plate.toUpperCase());
  }
  return [];
}
