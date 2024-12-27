import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { FiUpload, FiDatabase, FiPieChart, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Layout>
        <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-500/10 to-purple-500/10 blur-3xl rounded-full transform translate-x-1/3 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-indigo-500/10 to-pink-500/10 blur-3xl rounded-full transform -translate-x-1/3 translate-y-1/4"></div>

          {/* Welcome Section */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center mb-16"
            >
              <div className="inline-block">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-2 block"
                >
                  Welcome back,
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-gray-900 mb-4"
                >
                  {session.user?.name}
                </motion.h2>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 mb-12"
              >
                Let's transform your data into meaningful insights
              </motion.p>
            </motion.div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Upload Data Card */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-all duration-300"></div>
                <div className="relative h-full bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                    <FiUpload className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Upload Data</h3>
                  <p className="text-gray-600 mb-8">Import your Excel or CSV files</p>
                  <Link
                    href="/upload"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Get Started <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>

              {/* Manage Datasets Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-all duration-300"></div>
                <div className="relative h-full bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                    <FiDatabase className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Manage Datasets</h3>
                  <p className="text-gray-600 mb-8">View and organize your data</p>
                  <Link
                    href="/datasets"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Get Started <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>

              {/* Visualize Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-all duration-300"></div>
                <div className="relative h-full bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                    <FiPieChart className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Visualize</h3>
                  <p className="text-gray-600 mb-8">Create interactive charts</p>
                  <Link
                    href="/visualizations"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Get Started <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ... rest of the code for non-authenticated users ...
}
