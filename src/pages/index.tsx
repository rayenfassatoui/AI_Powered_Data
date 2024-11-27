import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FiUpload, FiDatabase, FiBarChart2 } from 'react-icons/fi';
import Layout from '@/components/Layout';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to DataViz AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
          Transform your data into actionable insights with AI-powered analytics
          and beautiful visualizations.
        </p>
        <button
          onClick={() => router.push('/auth/signin')}
          className="btn-primary text-lg"
        >
          Get Started
        </button>
      </div>
    );
  }

  const features = [
    {
      icon: FiUpload,
      title: 'Upload Data',
      description: 'Import your Excel or CSV files',
      path: '/upload',
    },
    {
      icon: FiDatabase,
      title: 'Manage Datasets',
      description: 'View and organize your data',
      path: '/datasets',
    },
    {
      icon: FiBarChart2,
      title: 'Visualize',
      description: 'Create interactive charts',
      path: '/visualizations',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {session.user?.name}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <button
              key={feature.path}
              onClick={() => router.push(feature.path)}
              className="card hover:shadow-lg transition-shadow"
            >
              <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
