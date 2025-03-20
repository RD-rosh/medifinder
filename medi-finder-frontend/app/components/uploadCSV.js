import { useState } from "react";
import axios from "axios";

export default function UploadCSV() {
  const [file, setFile] = useState(null);

  function handleFileUpload(e) {
    setFile(e.target.files[0]);
  }

  async function uploadCSV() {
    const formData = new FormData();
    formData.append("file", file);
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pharmacy/upload-csv/`, formData);
    alert("Stock updated!");
  }

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={uploadCSV}>Upload</button>
    </div>
  );
}
