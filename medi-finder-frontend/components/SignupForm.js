"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

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

    const userData = {
      username: e.target.username.value,
      password: e.target.password.value,
      email: e.target.email.value,
      pharmacy_name: e.target.pharmacy_name.value,
      address: e.target.address.value,
      phone: e.target.phone.value,
      online_delivery: e.target.online_delivery.checked,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        router.push('/login');
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen pt-16"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
    
      <div>
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
      
    </div>
    <div className="min-h-screen flex items-center justify-center mt-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
              <p className="text-gray-500">Join MediFinder as a pharmacy owner</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  required />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  required />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  required />
              </div>

              <div className="space-y-2">
                <label htmlFor="pharmacy_name" className="text-sm font-medium text-gray-700">
                  Pharmacy Name
                </label>
                <input
                  id="pharmacy_name"
                  name="pharmacy_name"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none" />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  required />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  required />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="online_delivery"
                  name="online_delivery"
                  type="checkbox"
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                <label htmlFor="online_delivery" className="text-sm font-medium text-gray-700">
                  Offer Online Delivery
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Create Account
              </button>

              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      </div>
      
    
    
  );
}