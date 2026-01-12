const BaseURL = "http://localhost:8000/api";

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BaseURL}/upload`, {
    method: "POST",
    body: formData
  });

  return res.json();
}

export async function parseText(rawText) {
  const res = await fetch(`${BaseURL}/parse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ raw_text: rawText })
  });

  return res.json();
}
