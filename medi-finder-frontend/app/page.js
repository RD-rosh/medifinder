"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

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
        //setMedicines(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchMedicines, 500);

    return () => clearTimeout(debounceTimer); // Cleanup on unmount
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search for Medicines</h1>
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Enter medicine name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      <ul>
        {medicines.map((med) => (
          <li key={med.id} className="border p-2 mt-2">
            <p>{med.name} - {med.brand}</p>
            <p>Available at: {med.pharmacy} ({med.address})</p>
            {/* <p>Available at: {med?.pharmacy?.name} ({med?.pharmacy?.address})</p> */}
            {med?.phone && (
  <a
    href={`https://wa.me/${med.phone}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600"
  >
    {med.phone}<br></br>Chat on WhatsApp
  </a>
)}

          </li>
        ))}
      </ul>
    </div>
  );
}
