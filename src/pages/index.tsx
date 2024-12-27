import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiDatabase,
  FiBarChart2,
  FiArrowRight,
  FiPieChart,
  FiTrendingUp,
  FiGrid,
  FiLayers,
  FiZap,
  FiShield,
  FiCpu,
  FiGlobe,
  FiUsers,
  FiAward,
  FiGithub,
  FiLinkedin,
  FiCheck,
  FiPlay,
} from "react-icons/fi";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
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
        description: "Process and visualize your data in seconds",
      },
      {
        icon: FiCpu,
        title: "AI-Powered",
        description: "Advanced analytics with machine learning",
      },
      {
        icon: FiShield,
        title: "Secure",
        description: "Enterprise-grade security for your data",
      },
    ];

    const testimonials = [
      {
        name: "Ashref Ben Abdallah",
        role: "Data Engineer",
        company: "TechForge",
        content:
          "DataViz AI has transformed how we analyze and present our data. The AI-powered insights are game-changing.",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=ashref&backgroundColor=b6e3f4&radius=50",
      },
      {
        name: "Ahmed Balti",
        role: "ML Engineer",
        company: "DataSphere",
        content:
          "The speed and accuracy of the visualizations are impressive. It's become an essential tool for our team.",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed&backgroundColor=c0aede&radius=50",
      },
      {
        name: "Khayredine Gabsi",
        role: "Data Scientist",
        company: "AI Solutions",
        content:
          "The automated insights have helped us discover patterns we would have missed otherwise.",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=khayredine&backgroundColor=b6e3f4&radius=50",
      },
    ];

    const pricingPlans = [
      {
        name: "Starter",
        price: "Free",
        features: [
          "5 Datasets",
          "Basic Visualizations",
          "Community Support",
          "1GB Storage",
        ],
        highlighted: false,
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
          "Custom Branding",
        ],
        highlighted: true,
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
          "Custom Features",
        ],
        highlighted: false,
      },
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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <FiBarChart2 className="w-6 h-6 text-white transform rotate-12" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  DataViz AI
                </span>
              </motion.div>

              <div className="flex items-center space-x-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden md:flex items-center space-x-6"
                >
                  <a
                    href="#features"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#tools"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Tools
                  </a>
                  <a
                    href="#pricing"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Pricing
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => router.push("/auth/signin")}
                    className="group relative inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    <span className="relative z-10 flex items-center">
                      Sign In
                      <FiArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50/50"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-400/30 to-pink-400/30 rounded-full filter blur-3xl opacity-50 animate-pulse delay-1000"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            {/* Floating elements */}
            <div className="absolute -top-20 left-1/4 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob"></div>
            <div className="absolute -top-20 right-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-4000"></div>

            {/* Main content */}
            <div className="relative text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <div className="mb-8 inline-flex items-center rounded-full bg-blue-50 p-2 pr-6 shadow-lg shadow-blue-900/5 ring-1 ring-blue-900/5">
                  <div className="rounded-full bg-white p-1 shadow-sm">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                      <FiZap className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-blue-600">
                    Powered by Advanced AI Technology
                  </span>
                </div>

                <h1 className="relative z-10 text-5xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 leading-tight mb-8">
                  Transform Your Data Into
                  <br />
                  <span className="relative inline-block mt-2">
                    <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient">
                      Powerful Insights
                    </span>
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transform origin-left"></div>
                  </span>
                </h1>

                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Harness the power of AI to analyze, visualize, and understand
                  your data like never before. Create stunning visualizations in{" "}
                  <span className="relative inline-block px-2">
                    <span className="relative z-10 font-semibold text-blue-600">
                      minutes
                    </span>
                    <div className="absolute inset-0 bg-blue-100 transform -rotate-2 rounded"></div>
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/auth/signin")}
                    className="group relative inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-200"
                  >
                    <span className="relative z-10 flex items-center">
                      Get Started Free
                      <FiArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-500 transition-all duration-200"
                  >
                    <FiPlay className="mr-2 h-5 w-5 text-blue-600" />
                    Watch Demo
                  </motion.button>
                </div>

                {/* Trust badges */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="flex items-center justify-center space-x-2 px-6 py-4 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50">
                    <FiShield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Enterprise-grade security
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 px-6 py-4 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50">
                    <FiUsers className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      10,000+ users
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 px-6 py-4 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50">
                    <FiAward className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      4.9/5 rating
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Initial Features */}
        <div className="relative z-10 py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: FiZap,
                  title: "Lightning Fast",
                  description: "Process and visualize your data in seconds",
                  gradient: "from-yellow-500 to-orange-500",
                },
                {
                  icon: FiCpu,
                  title: "AI-Powered",
                  description: "Advanced analytics with machine learning",
                  gradient: "from-blue-500 to-indigo-500",
                },
                {
                  icon: FiShield,
                  title: "Secure",
                  description: "Enterprise-grade security for your data",
                  gradient: "from-green-500 to-emerald-500",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200/50 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                      }}
                    ></div>

                    <div className="relative z-10">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>

                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="relative z-10 py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Powerful Tools at Your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Fingertips
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to transform your data into actionable
                insights
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  icon: FiPieChart,
                  label: "Charts",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: FiTrendingUp,
                  label: "Analytics",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: FiCpu,
                  label: "AI Insights",
                  gradient: "from-green-500 to-emerald-500",
                },
                {
                  icon: FiGrid,
                  label: "Dashboard",
                  gradient: "from-orange-500 to-red-500",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 flex flex-col items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">
                      {item.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
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
                Why Choose{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  DataViz AI
                </span>
                ?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of data analytics with our cutting-edge
                features and capabilities.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: FiZap,
                  title: "Real-time Processing",
                  description:
                    "Process large datasets instantly with our optimized algorithms and cloud infrastructure.",
                  features: [
                    "Instant data processing",
                    "Live collaboration",
                    "Real-time updates",
                  ],
                  gradient: "from-yellow-500 to-orange-500",
                },
                {
                  icon: FiCpu,
                  title: "Advanced AI Analytics",
                  description:
                    "Leverage state-of-the-art machine learning models for deeper insights.",
                  features: [
                    "Predictive analytics",
                    "Pattern recognition",
                    "Anomaly detection",
                  ],
                  gradient: "from-blue-500 to-indigo-500",
                },
                {
                  icon: FiShield,
                  title: "Enterprise Security",
                  description:
                    "Bank-grade security measures to protect your sensitive data.",
                  features: [
                    "End-to-end encryption",
                    "SOC 2 compliance",
                    "Regular security audits",
                  ],
                  gradient: "from-green-500 to-emerald-500",
                },
                {
                  icon: FiGlobe,
                  title: "Global Scalability",
                  description:
                    "Scale your data operations globally with our distributed infrastructure.",
                  features: [
                    "Multi-region support",
                    "Auto-scaling",
                    "High availability",
                  ],
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: FiUsers,
                  title: "Team Collaboration",
                  description:
                    "Work seamlessly with your team in real-time on data projects.",
                  features: [
                    "Role-based access",
                    "Version control",
                    "Activity tracking",
                  ],
                  gradient: "from-red-500 to-pink-500",
                },
                {
                  icon: FiAward,
                  title: "Industry Excellence",
                  description:
                    "Award-winning platform trusted by leading organizations worldwide.",
                  features: ["99.9% uptime", "24/7 support", "Regular updates"],
                  gradient: "from-teal-500 to-cyan-500",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 overflow-hidden">
                    {/* Gradient background effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                      }}
                    ></div>

                    <div className="relative z-10">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>

                      <p className="text-gray-600 mb-6">
                        {feature.description}
                      </p>

                      <ul className="space-y-2">
                        {feature.features.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center text-gray-600"
                          >
                            <FiCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
                Powerful Tools at Your{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Fingertips
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A comprehensive suite of tools designed to transform your data
                into actionable insights.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "Interactive Dashboards",
                  description:
                    "Create stunning, interactive dashboards with drag-and-drop simplicity.",
                  icon: FiGrid,
                  features: [
                    "Custom layouts",
                    "Real-time updates",
                    "Interactive filters",
                  ],
                  gradient: "from-purple-500 to-indigo-500",
                  image: "/dashboard-preview.png",
                },
                {
                  title: "Advanced Analytics",
                  description:
                    "Powerful analytics tools to uncover hidden patterns in your data.",
                  icon: FiTrendingUp,
                  features: [
                    "Statistical analysis",
                    "Trend detection",
                    "Forecasting",
                  ],
                  gradient: "from-blue-500 to-cyan-500",
                  image: "/analytics-preview.png",
                },
                {
                  title: "Data Visualization",
                  description:
                    "Transform complex data into beautiful, insightful visualizations.",
                  icon: FiPieChart,
                  features: [
                    "Multiple chart types",
                    "Custom styling",
                    "Export options",
                  ],
                  gradient: "from-green-500 to-teal-500",
                  image: "/visualization-preview.png",
                },
                {
                  title: "AI-Powered Insights",
                  description:
                    "Let AI uncover insights and patterns automatically.",
                  icon: FiCpu,
                  features: [
                    "Automated analysis",
                    "Smart suggestions",
                    "Predictive insights",
                  ],
                  gradient: "from-orange-500 to-red-500",
                  image: "/ai-preview.png",
                },
              ].map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                    }}
                  ></div>

                  <div className="p-8">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      <tool.icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {tool.title}
                    </h3>

                    <p className="text-gray-600 mb-6">{tool.description}</p>

                    <ul className="space-y-3 mb-6">
                      {tool.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <FiCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`mt-4 px-6 py-2 rounded-xl text-white bg-gradient-to-r ${tool.gradient} shadow-md hover:shadow-lg transition-all duration-300`}
                    >
                      Learn More
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="relative z-10 py-32 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-indigo-50">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-400/20 to-pink-400/20 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-20"
            >
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
                Testimonials
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Loved by Data Teams{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Everywhere
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied users who have transformed their
                data analysis workflow.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-indigo-50/50 filter blur-3xl opacity-50 pointer-events-none"></div>

              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                    {/* Quote icon */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center mb-8">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              width={64}
                              height={64}
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {testimonial.role} · {testimonial.company}
                          </p>
                        </div>
                      </div>

                      <blockquote className="relative">
                        <p className="text-gray-600 italic leading-relaxed">
                          "{testimonial.content}"
                        </p>
                      </blockquote>

                      {/* Rating stars */}
                      <div className="mt-6 flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Call to action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-16 text-center"
            >
              <p className="text-gray-600 mb-6">
                Join over{" "}
                <span className="font-semibold text-blue-600">10,000+</span>{" "}
                data professionals who trust DataViz AI
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30"
                onClick={() => router.push("/auth/signin")}
              >
                Get Started Free
                <FiArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="relative z-10 py-32 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50/50">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/10 to-pink-400/10 rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-20"
            >
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
                Pricing Plans
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Simple,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Transparent
                </span>{" "}
                Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the perfect plan for your data visualization needs. No
                hidden fees.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative group"
                >
                  <div
                    className={`relative rounded-2xl p-8 ${
                      plan.highlighted
                        ? "bg-gradient-to-b from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30"
                        : "bg-white/80 backdrop-blur-xl shadow-xl border border-gray-100"
                    }`}
                  >
                    {/* Decorative elements */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
                      style={{
                        backgroundImage: plan.highlighted
                          ? "linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.1))"
                          : "linear-gradient(to bottom right, var(--tw-gradient-stops))",
                      }}
                    ></div>

                    {plan.highlighted && (
                      <div className="absolute -top-5 left-0 right-0 mx-auto w-32 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-white text-sm font-semibold shadow-lg transform -rotate-1">
                        Most Popular
                      </div>
                    )}

                    <div className="relative z-10">
                      <h3
                        className={`text-2xl font-bold mb-4 ${
                          plan.highlighted ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {plan.name}
                      </h3>

                      <div className="mb-6">
                        <span
                          className={`text-5xl font-bold ${
                            plan.highlighted ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span
                            className={`text-xl ${
                              plan.highlighted
                                ? "text-blue-100"
                                : "text-gray-600"
                            }`}
                          >
                            {plan.period}
                          </span>
                        )}
                      </div>

                      <div
                        className={`h-px w-full ${
                          plan.highlighted ? "bg-white/20" : "bg-gray-200"
                        } my-6`}
                      ></div>

                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: index * 0.1 + featureIndex * 0.1,
                            }}
                            className={`flex items-center ${
                              plan.highlighted ? "text-white" : "text-gray-600"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                                plan.highlighted
                                  ? "bg-blue-400/20"
                                  : "bg-blue-100"
                              }`}
                            >
                              <FiCheck
                                className={`w-3 h-3 ${
                                  plan.highlighted
                                    ? "text-white"
                                    : "text-blue-600"
                                }`}
                              />
                            </div>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/auth/signin")}
                        className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center group ${
                          plan.highlighted
                            ? "bg-white text-blue-600 hover:bg-blue-50"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                        }`}
                      >
                        Get Started
                        <FiArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* FAQ Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-20 text-center"
            >
              <p className="text-gray-600 mb-6">
                Have questions? Check out our{" "}
                <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
                  FAQ
                </span>{" "}
                or contact our support team.
              </p>
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center text-gray-600">
                  <FiShield className="w-5 h-5 mr-2 text-blue-600" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiCpu className="w-5 h-5 mr-2 text-blue-600" />
                  <span>No credit card required</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative z-10 py-32 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  number: "10K+",
                  label: "Active Users",
                  icon: FiUsers,
                  gradient: "from-blue-500 to-indigo-500",
                },
                {
                  number: "1M+",
                  label: "Visualizations Created",
                  icon: FiPieChart,
                  gradient: "from-indigo-500 to-purple-500",
                },
                {
                  number: "500+",
                  label: "Enterprise Clients",
                  icon: FiGlobe,
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  number: "99.9%",
                  label: "Uptime",
                  icon: FiZap,
                  gradient: "from-pink-500 to-red-500",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200/50 text-center">
                    <div
                      className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                      }}
                    ></div>

                    <div className="relative z-10">
                      <div
                        className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>

                      <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                        {stat.number}
                      </div>
                      <div className="text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative z-10 py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl transform rotate-1"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl -rotate-1">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px]"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/30 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[800px] h-[800px] bg-blue-500/30 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
                  </div>
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
                    Join thousands of data teams who are already using DataViz
                    AI to unlock insights.
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/auth/signin")}
                    className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl bg-white text-blue-600 hover:bg-blue-50 shadow-xl shadow-blue-500/30 transition-all duration-200"
                  >
                    Get Started Free
                    <FiArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-gray-900 pt-24 pb-12 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-gray-900/90"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                    <FiBarChart2 className="w-6 h-6 text-white transform rotate-12" />
                  </div>
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                    DataViz AI
                  </span>
                </div>
                <p className="text-gray-400 mb-6">
                  Transform your data into actionable insights with AI-powered
                  analytics.
                </p>
              </div>

              {[
                {
                  title: "Product",
                  links: ["Features", "Pricing", "Security", "Enterprise"],
                },
                {
                  title: "Company",
                  links: ["About", "Blog", "Careers", "Contact"],
                },
                {
                  title: "Resources",
                  links: [
                    "Documentation",
                    "API Reference",
                    "Guides",
                    "Support",
                  ],
                },
              ].map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-white mb-6">
                    {section.title}
                  </h3>
                  <ul className="space-y-4">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-8 mt-8 border-t border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © 2024 DataViz AI. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a
                    href="https://github.com/rayenfassatoui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FiGithub className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/rayenfassatoui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FiLinkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  const features = [
    {
      icon: FiUpload,
      title: "Upload Data",
      description: "Import your Excel or CSV files",
      path: "/upload",
      color: "blue",
    },
    {
      icon: FiDatabase,
      title: "Manage Datasets",
      description: "View and organize your data",
      path: "/datasets",
      color: "indigo",
    },
    {
      icon: FiBarChart2,
      title: "Visualize",
      description: "Create interactive charts",
      path: "/visualizations",
      color: "purple",
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
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <feature.icon
                          className={`h-8 w-8 text-${feature.color}-600`}
                        />
                      </motion.div>
                      <h2
                        className={`text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-${feature.color}-600 to-${feature.color}-800`}
                      >
                        {feature.title}
                      </h2>
                    </div>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
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
