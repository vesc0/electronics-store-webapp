"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaChartBar, FaBox, FaTags } from "react-icons/fa";
import axios from "axios";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sections = [
    { name: "Analytics", icon: <FaChartBar /> },
    { name: "Products", icon: <FaTags /> },
    { name: "Orders", icon: <FaBox /> },
  ];

  return (
    <div className="w-60 h-screen p-2 bg-gray-200 text-gray-800 flex flex-col justify-between transition-all ease-in-out duration-300 sm:w-56 lg:w-48">
      <h1 className="text-lg font-semibold text-center py-4 border-b border-gray-300 text-gray-900">
        Admin Panel
      </h1>

      <ul className="mt-4 space-y-1 flex-grow">
        {sections.map((section) => (
          <li
            key={section.name}
            className={`flex items-center px-4 py-2 cursor-pointer transition-colors duration-200 
              ${
                activeSection === section.name
                  ? "bg-gray-400 text-black rounded-lg"
                  : "hover:bg-gray-300 text-gray-700 rounded-lg"
              }`}
            onClick={() => onSectionChange(section.name)}
          >
            <span className="text-lg mr-2">{section.icon}</span>
            {section.name}
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-300">
        <button
          className="w-full rounded-lg text-left px-4 py-3 text-red-600 hover:bg-red-100 flex items-center justify-center"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;