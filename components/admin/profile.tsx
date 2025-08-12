"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Profile() {
  const [user, setUser] = useState({ username: "" });
  const pathname = usePathname();

  useEffect(() => {
    const username = localStorage.getItem("username") || "";
    setUser({ username });
  }, []);

  const getTitle = () => {
    if (pathname === "/admin") return "Articles";
    if (pathname === "/admin/category") return "Category";
    if (pathname.startsWith("/admin/")) return "Article";
    if (pathname === "/profile") return "User Profile";
    return "";
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-black ">{getTitle()}</h1>

        <div className="relative">
          <Link
            href="/profile"
            className="flex items-center space-x-3 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-gray-700">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium underline text-gray-700">
              {user.username}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
