"use client"
import { useState } from "react";
import axios from "axios";

export default function UploadCSV({ token, pharmacyId,onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFileUpload(e) {
    setFile(e.target.files[0]);
    setError(null);
  }

  async function uploadCSV() {
    if (!file) {
      setError("Please select a file");
      return;
    }

    if (!token) {
      console.error('Token is missing:', token);
      setError("Authentication token is missing");
      return;
    }


    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pharmacy_id", pharmacyId);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/upload_csv/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
          withCredentials: true
          }
        
      );
      
      if (response.data.message) {
        alert(response.data.message);
        setFile(null);
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }
    }  catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.detail || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg text-gray-700 font-semibold mb-4">Update Stock via CSV</h3>
      <div className="flex flex-col gap-4">
        <input 
          type="file" 
          onChange={handleFileUpload}
          accept=".csv"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <button 
          onClick={uploadCSV}
          disabled={!file || loading}
          className={`px-4 py-2 rounded-md text-white font-medium
            ${!file || loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {loading ? 'Uploading...' : 'Upload CSV'}
        </button>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}

