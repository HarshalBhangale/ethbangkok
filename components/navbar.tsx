"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { ready, authenticated, logout } = usePrivy();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md mx-5 md:mx-20 lg:mx-28 xl:mx-36 2xl:mx-44 md:px-10 my-8 border border-neutral-300 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-[3rem] shadow-lg relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 bottom-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/images/navbar-bg.jpg')" }}
      ></div>
      <div className="max-w-screen-3xl flex flex-wrap items-center justify-between px-4 py-4 relative z-10">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 tracking-wider">
            Royale Squad
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-200 rounded-lg lg:hidden bg-gray-700/70 hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105"
          aria-expanded={isMobileMenuOpen ? "true" : "false"}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Links */}
        <div
          className={`w-full lg:block lg:w-auto ${isMobileMenuOpen ? "block" : "hidden"} transition-all duration-300 ease-in-out`}
          id="navbar-default"
        >
          <ul className="font-medium font-primary flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-10 md:mt-0  lg:bg-transparent lg:backdrop-filter-none lg:backdrop-blur-none shadow-lg lg:shadow-none">
            {["Dashboard", "Leaderboard", "Mybets", "Profilea"].map((item, index) => (
              <li key={index}>
                <Link
                  href={`/${item.toLowerCase()}`}
                  className={`block py-2 px-3 rounded-lg ${
                    pathname === `/${item.toLowerCase()}`
                      ? "text-purple-600 font-semibold bg-purple-100"
                      : "text-gray-700 hover:text-purple-600"
                  } transition-colors duration-300 ease-in-out hover:bg-purple-100 lg:hover:bg-transparent`}
                  aria-current={pathname === `/${item.toLowerCase()}` ? "page" : undefined}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Logout Button */}
          <div className="flex md:hidden justify-center mt-4">
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-6 py-2 rounded-full transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Desktop Logout Button */}
        <div className="hidden md:flex items-center">
          <button
            onClick={logout}
            className="bg-gradient-to-b from-purple-600 to-purple-700 text-white text-sm px-6 py-2 rounded-full transition duration-300 ease-in-out shadow-lg transform hover:scale-105 hover:from-purple-700 hover:to-purple-800"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
