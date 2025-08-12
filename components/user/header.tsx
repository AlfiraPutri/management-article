"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState({ username: "" });

  const pathname = usePathname();

  useEffect(() => {
    const username = localStorage.getItem("username") || "";
    setUser({ username });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const logoSrc = pathname === "/" ? "/images/Logo.png" : "/images/Frame.png";
  const usernameColor =
    pathname === "/profile" || pathname.startsWith("/articles" ) || pathname.startsWith("/admin/articles" ) 
      ? "text-black"
      : "text-white";

  return (
    <>
      <header className="relative z-10 max-w-7xl mx-auto flex justify-between items-center px-6 py-4 text-white">
        <Image src={logoSrc} alt="Logo" width={134} height={24} />

        <div className="relative">
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex flex-1 items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-gray-700">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <span className={`font-medium underline ${usernameColor}`}>
                {user.username}
              </span>
            </div>
          </div>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => setIsOpen(false)}
              />

              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg overflow-hidden z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  My Account
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {showLogoutModal && (
        <div className="bg-opacity-40 flex items-center justify-center z-[100] fixed inset-0 bg-black/20 backdrop-blur-sm z-40">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-black">Logout</h2>
            <p className="mb-6 text-gray-500">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-400 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
