import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';
import { FiArrowRight, FiCheck, FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import Image from 'next/image';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }} 
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-24 -right-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl rounded-full"
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-24 -left-20 w-96 h-96 bg-gradient-to-tr from-green-500/10 via-blue-500/10 to-purple-500/10 blur-3xl rounded-full"
        />
      </div>

      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold mb-12"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  DataViz AI
                </span>
                <p className="text-lg font-normal text-gray-600 mt-2">
                  Transform your data into powerful insights
                </p>
              </motion.div>

              <div className="space-y-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl">
                        <feature.icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats Section */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right side - Sign in */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="text-center space-y-3 mb-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mx-auto flex items-center justify-center"
                >
                  <FiBarChart2 className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Welcome to DataViz AI
                </h2>
                <p className="text-gray-500">Sign in to access your analytics dashboard</p>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center"
                  >
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
              >
                <FaGoogle className="w-5 h-5" />
                <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
                {!isLoading && <FiArrowRight className="w-5 h-5 ml-2" />}
              </motion.button>

              <p className="mt-6 text-center text-sm text-gray-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: FiBarChart2,
    title: 'Interactive Analytics',
    description: 'Create stunning visualizations with our intuitive tools'
  },
  {
    icon: FiPieChart,
    title: 'AI-Powered Insights',
    description: 'Get intelligent analysis and recommendations'
  },
  {
    icon: FiTrendingUp,
    title: 'Real-time Updates',
    description: 'Monitor your data with live dashboard updates'
  }
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '1M+', label: 'Visualizations' },
  { value: '99.9%', label: 'Uptime' }
];
