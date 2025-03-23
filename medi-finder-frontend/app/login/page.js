"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const result = await signIn("credentials", { username, password, redirect: false });
    if (!result.error) {
      router.push("/dashboard");
    } else {
      alert("Login failed!");
    }
  }

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

  return (
    <div>
      <div className="min-h-screen pt-16"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
      
        
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
        
     
      <div className="min-h-screen flex items-center justify-center mt-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-700">Sign in to manage your pharmacy</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none placeholder-gray-500"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
            </form>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                New to MediFinder?{" "}
                <Link 
                  href="/signup" 
                  className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}