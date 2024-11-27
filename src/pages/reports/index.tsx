import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import CreateReportModal from '@/components/CreateReportModal';
import { FiDownload, FiShare2, FiEdit, FiPlus, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Report {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'draft' | 'in_progress' | 'complete';
  createdAt: string;
  updatedAt: string;
}

export default function Reports() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    fetchReports();
  }, [status, router]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // In a real application, this would be an API call
      const mockReports: Report[] = [
        {
          id: '1',
          title: 'Q4 2023 Sales Analysis',
          description: 'Comprehensive analysis of Q4 sales performance and trends',
          type: 'Sales',
          status: 'complete',
          createdAt: '2023-12-15T10:00:00Z',
          updatedAt: '2023-12-20T15:30:00Z'
        },
        {
          id: '2',
          title: 'Customer Segmentation Report',
          description: 'Analysis of customer segments and behavior patterns',
          type: 'Marketing',
          status: 'in_progress',
          createdAt: '2023-12-18T09:00:00Z',
          updatedAt: '2023-12-19T14:20:00Z'
        }
      ];
      setReports(mockReports);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching reports');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = (reportData: any) => {
    const newReport = {
      id: String(reports.length + 1),
      title: reportData.title,
      description: reportData.description,
      type: reportData.type || 'custom',
      createdAt: new Date().toISOString(),
      status: 'active',
      metrics: reportData.metrics,
      visualizations: reportData.visualizations
    };

    setReports(prev => [newReport, ...prev]);
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      // In a real application, this would be an API call
      setReports(reports.filter(report => report.id !== reportId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting report');
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Report
          </button>
        </div>

        {/* Controls */}
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="in_progress">In Progress</option>
                <option value="complete">Complete</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <AnimatePresence mode="popLayout">
          <motion.div className="grid gap-6">
            {filteredReports.map((report) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.title}</h3>
                    <p className="text-gray-700 mb-4">{report.description}</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-50 text-blue-700">
                        {report.type}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        report.status === 'complete' ? 'bg-green-50 text-green-700' :
                        report.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        {report.status.replace('_', ' ').charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title="Download"
                    >
                      <FiDownload className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title="Share"
                    >
                      <FiShare2 className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title="Edit"
                    >
                      <FiEdit className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete"
                      onClick={() => handleDeleteReport(report.id)}
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Add Modal */}
        <CreateReportModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateReport={handleCreateReport}
        />

        {!loading && filteredReports.length === 0 && (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Get started by creating a new report'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Create Report
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
