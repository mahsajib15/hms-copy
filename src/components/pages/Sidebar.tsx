"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  User,
  Settings,
  Store,
  ChevronDown,
  ChevronUp,
  CalendarArrowDown,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const toggleStoreMenu = () => setIsStoreOpen(!isStoreOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-200 dark:bg-gray-800"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/rooms"
              className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <Home size={20} />
              <span>Rooms</span>
            </Link>
            {/* <Link
              href="/store"
              className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <Store size={20} />
              <span>Store</span>
            </Link> */}

            <div className="relative">
              <button
                onClick={toggleStoreMenu}
                className="flex items-center justify-between w-full gap-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Link href="/store" className="flex items-center gap-3">
                  <Store size={20} />
                  <span>Store</span>
                </Link>
                {isStoreOpen ? <ChevronUp className="cursor-pointer" size={20} /> : <ChevronDown className="cursor-pointer" size={20} />}
              </button>
              {isStoreOpen && (
                <div className="mt-1 ml-8 space-y-1">
                  <Link
                    href="store/order"
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <CalendarArrowDown />
                    <span>Order</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-sm text-center text-gray-500">
            © 2025 Sobar Solution
          </div>
        </div>
      </aside>
    </>
  );
}
