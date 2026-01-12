import { useState } from "react";
import { uploadFile, parseText } from "../api";

export default function Upload({ onQuizReady }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    setLoading(true);

    const uploadRes = await uploadFile(file);
    if (uploadRes.error) {
      alert(uploadRes.error);
      setLoading(false);
      return;
    }

    const parseRes = await parseText(uploadRes.extracted_text);
    onQuizReady(parseRes);
    setLoading(false);
  };
  console.log("parseText", parseText);
  return (
    <div>
      <h2>Upload Question Paper</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload & Generate Quiz"}
      </button>
    </div>
  );
}
