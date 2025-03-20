"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [medicines, setMedicines] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pharmacy/medicines/`)
        .then((res) => setMedicines(res.data));
    }
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;

  if (!session) return null; // Prevent rendering if not authenticated

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pharmacy Dashboard</h1>
      <ul>
        {medicines.map((med) => (
          <li key={med.id} className="border p-2 mt-2">
            {med.name} - {med.brand} (Stock: {med.quantity})
          </li>
        ))}
      </ul>
    </div>
  );
}