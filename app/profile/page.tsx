"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/user/header";
import Footer from "@/components/user/footer";

export default function ProfilePage() {
  const [user, setUser] = useState({ username: "", password: "", role: "" });

  useEffect(() => {
    const username = localStorage.getItem("username") || "";
    const password = localStorage.getItem("password") || "";
    const role = localStorage.getItem("role") || "";

    setUser({ username, password, role });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="relative">
        <Header />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-black text-lg font-semibold mb-6">User Profile</h1>

        <div className="flex flex-col items-center ">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-gray-700 mb-6">
            {user.username.charAt(0)}
          </div>

          <div className="space-y-3 w-full max-w-xs">
            <div className="flex items-center">
              <span className="w-28 font-medium text-sm text-gray-700">
                Username :
              </span>
              <input
                type="text"
                value={user.username}
                disabled
                className="flex-1 rounded px-2 py-1 text-sm text-gray-600 bg-gray-100 text-center"
              />
            </div>
            <div className="flex items-center">
              <span className="w-28 font-medium text-sm text-gray-700">
                Password :
              </span>
              <input
                type="text"
                value={user.password}
                disabled
                className="flex-1 rounded px-2 py-1 text-sm text-gray-600 bg-gray-100 text-center"
              />
            </div>
            <div className="flex items-center">
              <span className="w-28 font-medium text-sm text-gray-700">
                Role :
              </span>
              <input
                type="text"
                value={user.role}
                disabled
                className="flex-1 rounded px-2 py-1 text-sm text-gray-600 bg-gray-100 text-center"
              />
            </div>
          </div>

          <Link
            href={user.role === "Admin" ? "/admin" : "/"}
            className="mt-6 bg-blue-700 text-white px-25 py-1 rounded hover:bg-blue-800 transition"
          >
            {user.role === "Admin" ? "Back to dashboard" : "Back to home"}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
