"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import UploadCSV from "@/components/uploadCSV";
import Link from "next/link";

const Dashboard = () => {
  const router = useRouter();
  const token = localStorage.getItem("token");
  const { data: session, status } = useSession();

  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPharmacyForm, setShowAddPharmacyForm] = useState(false);
  const [newPharmacy, setNewPharmacy] = useState({
    pharmacy_name: '',
    address: '',
    phone: '',
    online_delivery: false
  });

  const refreshMedicines = () => {
    if (selectedPharmacy) {
      fetchMedicines(selectedPharmacy);
    }
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

  const handleAddPharmacy = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/add-pharmacy/`,
      newPharmacy,
      {
        headers: {
          Authorization: `Token ${session?.accessToken}`,
        },
      }
    );

    if (response.data.message) {
      alert("Pharmacy added successfully!");
      setShowAddPharmacyForm(false);
      setNewPharmacy({
        pharmacy_name: '',
        address: '',
        phone: '',
        online_delivery: false
      });
      fetchPharmacies();
    }
  } catch (error) {
    console.error("Error adding pharmacy:", error);
    const errorMessage = error.response?.data?.error || "Failed to add pharmacy";
    alert(errorMessage);
  }
};

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    
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
    <div className="min-h-screen relative">
      <nav className="w-full bg-emerald-900 backdrop-blur-sm fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            MediFinder
          </Link>
          <div className="flex gap-8 text-gray-300">
            <Link href="/" className="hover:text-white transition-colors duration-200">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors duration-200">
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
              <Link href="/login" className="hover:text-white transition-colors duration-200">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div 
        className="min-h-screen pt-16"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="p-6 max-w-7xl mx-auto bg-white/65 backdrop-blur-sm shadow-lg rounded-2xl mt-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-700">
              Pharmacy <span className="text-emerald-900">Dashboard</span>
            </h1>
            <button
              onClick={() => setShowAddPharmacyForm(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              Add New Pharmacy
            </button>
          </div>

          {showAddPharmacyForm && (
            <div className="mb-6 p-4 border rounded-lg bg-white/90 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">Add New Pharmacy</h2>
              <form onSubmit={handleAddPharmacy} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pharmacy Name</label>
                  <input
                    type="text"
                    value={newPharmacy.pharmacy_name}
                    onChange={(e) => setNewPharmacy({...newPharmacy, pharmacy_name: e.target.value})}
                    className="mt-1 w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={newPharmacy.address}
                    onChange={(e) => setNewPharmacy({...newPharmacy, address: e.target.value})}
                    className="mt-1 w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={newPharmacy.phone}
                    onChange={(e) => setNewPharmacy({...newPharmacy, phone: e.target.value})}
                    className="mt-1 w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="online_delivery"
                    checked={newPharmacy.online_delivery}
                    onChange={(e) => setNewPharmacy({...newPharmacy, online_delivery: e.target.checked})}
                    className="h-4 w-4 text-emerald-600"
                  />
                  <label htmlFor="online_delivery" className="ml-2 text-sm text-gray-700">
                    Offer Online Delivery
                  </label>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    Add Pharmacy
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPharmacyForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <h2 className="text-lg font-semibold text-gray-700 mb-2">Select a Pharmacy</h2>
          <select
            value={selectedPharmacy}
            onChange={(e) => {
              const pharmacyId = e.target.value;
              setSelectedPharmacy(pharmacyId);
              fetchMedicines(pharmacyId);
            }}
            className="w-full p-3 border rounded-lg shadow-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
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
              onUploadSuccess={refreshMedicines} 
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
                      <p className="text-gray-700">
                        Quantity: <span className="font-medium">{med.quantity}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mt-4">No medicines found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;