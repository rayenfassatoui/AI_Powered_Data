import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiBarChart2, FiUpload, FiDatabase, FiPieChart } from "react-icons/fi";

const publicNavigation = [
  { name: "Features", href: "#features" },
  { name: "Tools", href: "#tools" },
  { name: "Pricing", href: "#pricing" },
];

const authenticatedNavigation = [
  { name: "Upload Dataset", href: "/upload", icon: FiUpload },
  { name: "datasets", href: "/datasets", icon: FiDatabase },
  { name: "visualizations", href: "/visualizations", icon: FiPieChart },
];

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  const navigation = session ? authenticatedNavigation : publicNavigation;

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#6366F1] flex items-center justify-center">
                <FiBarChart2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                DataViz AI
              </span>
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base text-gray-600 hover:text-gray-900 flex items-center space-x-2"
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-10 w-10 rounded-full bg-[#6366F1] text-white flex items-center justify-center"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-lg font-medium">
                      {session.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="text-base font-medium text-gray-900">
                    {session.user?.name}
                  </span>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  className="text-gray-600"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => signIn("google")}
                className="bg-[#6366F1] text-white px-4 py-2 rounded-lg"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500"
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
            className="md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="px-4 pt-2 pb-3 space-y-1 bg-white border-b border-gray-100">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-base text-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{item.name}</span>
                </Link>
              ))}
              {!session && (
                <Button
                  onClick={() => {
                    signIn("google");
                    setIsOpen(false);
                  }}
                  className="w-full mt-2 bg-[#6366F1] text-white px-4 py-2 rounded-lg"
                >
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
