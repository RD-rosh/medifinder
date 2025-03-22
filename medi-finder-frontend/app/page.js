"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"

export default function Home() {
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const navigateToDashboard = () => {
    router.push("dashboard"); 
    };

  useEffect(() => {
    if (query.length < 3) {
      setMedicines([]);
      return;
    }

    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/search/?search=${query}`
        );
        console.log("API Response:", res.data);
        setMedicines(Array.isArray(res.data.results) ? res.data.results : []);
        
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchMedicines, 500);

    return () => clearTimeout(debounceTimer); 
  }, [query]);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-2xl">
      
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Welcome to <span className="text-blue-600">Medi Finder</span>
      </h1>

      <button
        onClick={navigateToDashboard}
        className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md hover:opacity-90 transition"
      >
        Go to Dashboard
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Search for Medicines</h2>
        <input
          type="text"
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 transition"
          placeholder="Enter medicine name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && <p className="text-gray-600 mt-4 text-center">⏳ Searching...</p>}

      <ul className="mt-6 space-y-4">
        {medicines.map((med) => (
          <li key={med.id} className="p-4 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition">
            <p className="text-lg font-semibold text-gray-800">
             {med.name} <span className="text-gray-600">({med.brand})</span>
            </p>
            <p className="text-gray-700">
              Available at: <span className="font-medium">{med.pharmacy}</span> ({med.address})
            </p>

            {med?.phone && (
              <a
                href={`https://wa.me/${med.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-white bg-green-500 px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
              >
                Chat on WhatsApp
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
