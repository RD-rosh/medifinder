"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import UploadCSV from "@/components/uploadCSV";

const Dashboard = () => {
  const router = useRouter();
  const token = localStorage.getItem("token");
  const { data: session, status } = useSession();

  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("token" , token);
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    console.log("Session Data:", session);
    if (!session) return;
    console.log("Session Data:", session);
    const fetchPharmacies = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/pharmacies/`,
          {
            headers: {
              Authorization: `Token ${session?.accessToken}`,
            },
            withCredentials: true, 
          }
        );

        setPharmacies(response.data);
      } catch (error) {
        console.error("Error fetching pharmacies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, [session]);

  const fetchMedicines = async (pharmacyId) => {
    if (!pharmacyId) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/medicines/${pharmacyId}/`
      );
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (status === "unauthenticated") return null;

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
        Pharmacy <span className="text-blue-600">Dashboard</span>
      </h1>

      <h2 className="text-lg font-semibold text-gray-700 mb-2">Select a Pharmacy</h2>
      <select
        value={selectedPharmacy}
        onChange={(e) => {
          const pharmacyId = e.target.value;
          setSelectedPharmacy(pharmacyId);
          fetchMedicines(pharmacyId);
        }}
        className="w-full p-3 border rounded-lg shadow-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        <option value="">Select a Pharmacy</option>
        {pharmacies.map((pharmacy) => (
          <option key={pharmacy.id} value={pharmacy.id}>
            {pharmacy.name}
          </option>
        ))}
      </select>

      {selectedPharmacy && (
          <UploadCSV 
            token={session?.accessToken}
            pharmacyId={selectedPharmacy}
          />
        )}
        
      {selectedPharmacy && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Medicine List</h2>
          {medicines.length > 0 ? (
            <ul className="space-y-3">
              {medicines.map((med) => (
                <li
                  key={med.id}
                  className="p-4 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition"
                >
                  <p className="text-lg font-semibold text-gray-800">
                    {med.name} <span className="text-gray-600">({med.brand})</span>
                  </p>
                  <p className="text-gray-700">Quantity: <span className="font-medium">{med.quantity}</span></p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 mt-4">No medicines found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
