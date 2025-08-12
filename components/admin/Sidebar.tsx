"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Newspaper, Tag, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: "Articles", href: "/admin", icon: <Newspaper size={18} /> },
    { name: "Category", href: "/admin/category", icon: <Tag size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <>
      <aside className="w-64 h-screen fixed top-0 left-0 bg-[#1E73E6] text-white flex flex-col p-6">
        <div className="mb-8">
          <Image src="/images/Logo.png" alt="Logo" width={134} height={24} />
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map(({ name, href, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors 
                  ${isActive ? "bg-blue-500" : "hover:bg-blue-400"}`}
              >
                {icon}
                <span>{name}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors text-left"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center z-[9999]">
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
