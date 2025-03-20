import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pharmacy Owner Login</h1>
      <form onSubmit={handleLogin}>
        <input type="text" className="border p-2 w-full" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" className="border p-2 w-full mt-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">Login</button>
      </form>
    </div>
  );
}
