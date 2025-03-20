
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const { data: session } = useSession();
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pharmacy/medicines/`).then((res) => setMedicines(res.data));
  }, []);

  if (!session) return <p>You must log in first</p>;

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
