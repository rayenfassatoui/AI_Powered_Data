import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiUpload, FiDatabase, FiBarChart2, FiArrowRight, FiPieChart, FiTrendingUp, FiGrid, FiLayers } from 'react-icons/fi';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-200 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gray-50">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
        <div className="absolute -top-24 -right-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl rounded-full transform rotate-12"></div>
        <div className="absolute -bottom-24 -left-20 w-96 h-96 bg-gradient-to-tr from-green-500/10 via-blue-500/10 to-purple-500/10 blur-3xl rounded-full transform -rotate-12"></div>

        <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                DataViz AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Transform your data into actionable insights with AI-powered analytics
              and beautiful visualizations.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => router.push('/auth/signin')}
                className="inline-flex items-center px-8 py-4 text-lg shadow-lg shadow-blue-500/30 border border-transparent font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Get Started
                <FiArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: FiPieChart, label: "Charts" },
              { icon: FiTrendingUp, label: "Analytics" },
              { icon: FiLayers, label: "AI Insights" },
              { icon: FiGrid, label: "Dashboard" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="p-6 rounded-xl bg-white shadow-lg flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-xl">
                  <item.icon className="w-8 h-8 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: FiUpload,
      title: 'Upload Data',
      description: 'Import your Excel or CSV files',
      path: '/upload',
      color: 'blue'
    },
    {
      icon: FiDatabase,
      title: 'Manage Datasets',
      description: 'View and organize your data',
      path: '/datasets',
      color: 'indigo'
    },
    {
      icon: FiBarChart2,
      title: 'Visualize',
      description: 'Create interactive charts',
      path: '/visualizations',
      color: 'purple'
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
          <div className="absolute -top-24 -right-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl rounded-full transform rotate-12"></div>
          <div className="absolute -bottom-24 -left-20 w-96 h-96 bg-gradient-to-tr from-green-500/10 via-blue-500/10 to-purple-500/10 blur-3xl rounded-full transform -rotate-12"></div>
          
          <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold">
                <span className="block text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">
                  Welcome back
                </span>
                <span className="mt-1 block text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 sm:text-5xl">
                  {session.user?.name}
                </span>
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                Let's transform your data into meaningful insights
              </p>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.path}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="group cursor-pointer"
                onClick={() => router.push(feature.path)}
              >
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden p-6">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-green-500/10 via-blue-500/10 to-purple-500/10 blur-3xl transform -rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div 
                        className={`p-3 bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/30 rounded-xl shadow-lg shadow-${feature.color}-500/20`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                      </motion.div>
                      <h2 className={`text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-${feature.color}-600 to-${feature.color}-800`}>
                        {feature.title}
                      </h2>
                    </div>
                    <p className="text-gray-600 mb-6">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-blue-600 group-hover:translate-x-2 transition-transform duration-300">
                      <span className="text-sm font-medium">Get Started</span>
                      <FiArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
