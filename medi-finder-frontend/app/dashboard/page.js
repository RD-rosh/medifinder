"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import Axios

const Dashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/pharmacies`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/medicines/${pharmacyId}/`
      );
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (status === "unauthenticated") return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pharmacy Dashboard</h1>

      <h2>Select a Pharmacy</h2>
      <select
        value={selectedPharmacy}
        onChange={(e) => {
          const pharmacyId = e.target.value;
          setSelectedPharmacy(pharmacyId);
          fetchMedicines(pharmacyId);
        }}
      >
        <option value="">Select a Pharmacy</option>
        {pharmacies.map((pharmacy) => (
          <option key={pharmacy.id} value={pharmacy.id}>
            {pharmacy.name}
          </option>
        ))}
      </select>

      {selectedPharmacy && (
        <>
          <h2>Medicine List</h2>
          {medicines.length > 0 ? (
            <ul>
              {medicines.map((med) => (
                <li key={med.id}>
                  {med.name} - {med.brand} (Qty: {med.quantity})
                </li>
              ))}
            </ul>
          ) : (
            <p>No medicines found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
