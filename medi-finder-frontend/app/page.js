"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"
import Link from "next/link";

export default function Home() {
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const navigateToDashboard = () => {
    router.push("dashboard"); 
    };

    const handleLogout = async () => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout/`,
          {},
          {
            headers: {
              Authorization: `Token ${session?.accessToken}`,
            },
          }
        );
       
        localStorage.removeItem("token");
        router.push("/");
      } catch (error) {
        console.error("Logout error:", error);
      }
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
    <div className="min-h-screen relative">
    <nav className="w-full w-full bg-emerald-900 backdrop-blur-sm fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            MediFinder
          </Link>
          <div className="flex gap-8 text-gray-300">
            <Link
              href="/dashboard"
              className="hover:text-white transition-colors duration-200"
            >
              Dashboard
            </Link>
            {status === "authenticated" ? (
              <button
                onClick={handleLogout}
                className="hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="hover:text-white transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

    
      <div className="min-h-screen pt-16"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="p-6 max-w-7xl mx-auto bg-white/50 backdrop-blur-sm shadow-lg rounded-2xl mt-8">
          <h1 className="text-3xl font-extrabold text-gray-600 mb-6 text-center">
            Welcome to <span className="text-emerald-900">MediFinder</span>
          </h1>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Search for Medicines</h2>
            <input
              type="text"
              className="w-full p-3 text-gray-800 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 transition"
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
 </div>
</div>
  );
}
