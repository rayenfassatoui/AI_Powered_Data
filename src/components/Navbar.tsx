import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiHome, FiPieChart, FiUpload, FiList, FiUser, FiLogOut, FiSearch, FiBarChart2 } from "react-icons/fi";

const navigation = [
  { name: "Features", href: "#features", icon: FiHome },
  { name: "Tools", href: "#tools", icon: FiPieChart },
  { name: "Pricing", href: "#pricing", icon: FiList },
];

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  const SignOutButton = () => (
    <Button
      onClick={() => signOut()}
      variant="ghost"
      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
    >
      <FiLogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </Button>
  );

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <FiBarChart2 className="w-6 h-6 text-white transform rotate-12" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                DataViz AI
              </span>
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="hidden sm:flex flex-1 justify-center">
            <div className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {session.user?.name}
                  </span>
                </div>
                <SignOutButton />
              </div>
            ) : (
              <Button
                onClick={() => signIn("google")}
                className="flex items-center space-x-2"
              >
                <FiUser />
                <span>Sign in</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sm:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {session ? (
                <SignOutButton />
              ) : (
                <button
                  onClick={() => {
                    signIn("google");
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                >
                  <FiUser className="mr-2" />
                  Sign in
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
