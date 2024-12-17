import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiUpload, FiDatabase, FiBarChart2, FiArrowRight, FiPieChart, FiTrendingUp, FiGrid, FiLayers, FiZap, FiShield, FiCpu, FiGlobe, FiUsers, FiAward, FiGithub, FiLinkedin, FiCheck } from 'react-icons/fi';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

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
    const features = [
      {
        icon: FiZap,
        title: "Lightning Fast",
        description: "Process and visualize your data in seconds"
      },
      {
        icon: FiCpu,
        title: "AI-Powered",
        description: "Advanced analytics with machine learning"
      },
      {
        icon: FiShield,
        title: "Secure",
        description: "Enterprise-grade security for your data"
      }
    ];

    const testimonials = [
      {
        name: "Sarah Johnson",
        role: "Data Scientist",
        company: "TechCorp",
        content: "DataViz AI has transformed how we analyze and present our data. The AI-powered insights are game-changing.",
        avatar: "/avatars/avatar1.jpg"
      },
      {
        name: "Michael Chen",
        role: "Product Manager",
        company: "InnovateLabs",
        content: "The speed and accuracy of the visualizations are impressive. It's become an essential tool for our team.",
        avatar: "/avatars/avatar2.jpg"
      },
      {
        name: "Emily Rodriguez",
        role: "Business Analyst",
        company: "DataDrive",
        content: "The automated insights have helped us discover patterns we would have missed otherwise.",
        avatar: "/avatars/avatar3.jpg"
      }
    ];

    const pricingPlans = [
      {
        name: "Starter",
        price: "Free",
        features: [
          "5 Datasets",
          "Basic Visualizations",
          "Community Support",
          "1GB Storage"
        ],
        highlighted: false
      },
      {
        name: "Pro",
        price: "$29",
        period: "/month",
        features: [
          "Unlimited Datasets",
          "Advanced Visualizations",
          "Priority Support",
          "10GB Storage",
          "AI-Powered Insights",
          "Custom Branding"
        ],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: "Custom",
        features: [
          "Everything in Pro",
          "Dedicated Support",
          "Unlimited Storage",
          "API Access",
          "SSO Integration",
          "Custom Features"
        ],
        highlighted: false
      }
    ];

    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 animate-slow-spin"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl rounded-full transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-green-500/10 via-blue-500/10 to-purple-500/10 blur-3xl rounded-full transform -rotate-12 animate-pulse"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              DataViz AI
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                onClick={() => router.push('/auth/signin')}
                className="px-6 py-2 text-sm shadow-md shadow-blue-500/20"
              >
                Sign In
              </Button>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-5xl sm:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  Transform Your Data
                </span>
                <br />
                <span className="text-gray-900">
                  Into Powerful Insights
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Harness the power of AI to analyze, visualize, and understand your data
                like never before. Create stunning visualizations in minutes.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button
                  onClick={() => router.push('/auth/signin')}
                  className="inline-flex items-center px-8 py-4 text-lg shadow-lg shadow-blue-500/30 border border-transparent font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Get Started Free
                  <FiArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -8 }}
                  className="relative group"
                >
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl p-8 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Tools Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-32 text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-16">Powerful Tools at Your Fingertips</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
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
                    <div className="p-6 rounded-xl bg-white shadow-lg flex flex-col items-center justify-center gap-3 transition-all duration-300 group-hover:shadow-xl border border-gray-100">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                        <item.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {item.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section with Animation */}
        <div className="relative z-10 py-32 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose DataViz AI?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features that set us apart and help you make better data-driven decisions.
              </p>
            </motion.div>

            {/* Existing Features Grid */}
          </div>
        </div>

        {/* Tools Showcase with 3D Effect */}
        <div className="relative z-10 py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Powerful Tools at Your Fingertips
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to transform your data into actionable insights.
              </p>
            </motion.div>

            {/* Existing Tools Grid */}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="relative z-10 py-32 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Loved by Data Teams Everywhere
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                See what our users have to say about DataViz AI.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-2xl p-8 shadow-xl"
                >
                  <div className="flex items-center mb-6">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">{testimonial.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="relative z-10 py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the plan that's right for you.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative bg-white rounded-2xl p-8 ${
                    plan.highlighted
                      ? 'shadow-2xl border-2 border-blue-500'
                      : 'shadow-xl border border-gray-100'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm font-medium">
                      Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    )}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600">
                        <FiCheck className="w-5 h-5 text-blue-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => router.push('/auth/signin')}
                    className={`w-full py-3 ${
                      plan.highlighted
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Get Started
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative z-10 py-32 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10K+", label: "Active Users" },
                { number: "1M+", label: "Visualizations Created" },
                { number: "500+", label: "Enterprise Clients" },
                { number: "99.9%", label: "Uptime" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative z-10 py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/30 to-transparent"></div>
              </div>
              <div className="relative py-16 px-8 sm:px-16 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-4xl font-bold text-white mb-6"
                >
                  Ready to Transform Your Data?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
                >
                  Join thousands of data teams who are already using DataViz AI to unlock insights.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    onClick={() => router.push('/auth/signin')}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-medium rounded-xl shadow-lg"
                  >
                    Get Started Free
                    <FiArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Enterprise</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guides</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Connect</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com/rayenfassatoui" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FiGithub className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/rayenfassatoui" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FiLinkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; 2024 DataViz AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
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
