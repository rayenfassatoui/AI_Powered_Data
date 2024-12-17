import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { HiLightningBolt } from 'react-icons/hi';
import Image from 'next/image';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        {/* Left side - Features */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex flex-col justify-center space-y-8 text-white"
        >
          <h1 className="text-5xl font-bold">
            Transform Your Data with AI
          </h1>
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side - Sign in */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center space-y-4 mb-8">
            <HiLightningBolt className="w-12 h-12 text-blue-400 mx-auto" />
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400">Sign in to access your analytics dashboard</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 bg-white text-gray-800 hover:bg-gray-100 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              <FaGoogle className="w-5 h-5" />
              <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            <p>By signing in, you agree to our</p>
            <div className="space-x-2">
              <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
              <span>&middot;</span>
              <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: HiLightningBolt,
    title: 'AI-Powered Analytics',
    description: 'Get instant insights with our advanced AI analysis tools'
  },
  {
    icon: FaGithub,
    title: 'Data Visualization',
    description: 'Create beautiful, interactive charts and reports'
  },
  {
    icon: FaGoogle,
    title: 'Seamless Integration',
    description: 'Connect with your favorite tools and platforms'
  }
];
