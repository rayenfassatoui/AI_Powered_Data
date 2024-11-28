import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import CreateReportModal from '@/components/CreateReportModal';
import ChartGrid from '@/components/ChartGrid';
import { FiDownload, FiShare2, FiEdit, FiPlus, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Report {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'in_progress' | 'complete';
  createdAt: string;
  updatedAt: string;
  metrics: Array<{
    id: string;
    name: string;
    value: any;
  }>;
  visualizations: Array<{
    id: string;
    type: string;
    data: any;
  }>;
  exportFormat: 'pdf' | 'excel' | 'csv';
  orientation: 'portrait' | 'landscape';
  includeRawData: boolean;
  dataset?: {
    name: string;
    type: string;
  };
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
      const response = await fetch('/api/reports');
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      setReports(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching reports');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async (reportData: any) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to create report');
      }

      setIsCreateModalOpen(false);
      await fetchReports();
    } catch (err) {
      console.error('Error creating report:', err);
      setError(err instanceof Error ? err.message : 'Error creating report');
    }
  };

  const handleEditReport = async (reportId: string) => {
    try {
      router.push(`/reports/${reportId}/edit`);
    } catch (err) {
      console.error('Error navigating to edit page:', err);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/download`);
      if (!response.ok) {
        throw new Error('Failed to download report');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading report:', err);
      setError(err instanceof Error ? err.message : 'Error downloading report');
    }
  };

  const handleShareReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/share`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate share link');
      }

      const { shareUrl } = await response.json();
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Error sharing report:', err);
      setError(err instanceof Error ? err.message : 'Error sharing report');
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete report');
      }

      await fetchReports();
    } catch (err) {
      console.error('Error deleting report:', err);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Reports</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Create Report
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
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
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No reports found.</p>
            <p className="text-gray-400 mt-2">Create a new report to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditReport(report.id)}
                      className="p-1 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                      title="Edit Report"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadReport(report.id)}
                      className="p-1 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                      title="Download Report"
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShareReport(report.id)}
                      className="p-1 hover:bg-purple-50 rounded-lg text-purple-600 transition-colors"
                      title="Share Report"
                    >
                      <FiShare2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-1 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                      title="Delete Report"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                {report.visualizations && report.visualizations.length > 0 && (
                  <div className="mb-4">
                    <ChartGrid visualizations={report.visualizations} />
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    report.status === 'complete' ? 'bg-green-100 text-green-700' :
                    report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {report.status.replace('_', ' ').charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {report.dataset && (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Dataset:</span>
                      <span className="ml-2">{report.dataset.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <span className="font-medium">Type:</span>
                      <span className="ml-2">{report.dataset.type}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <CreateReportModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateReport={handleCreateReport}
        />
      </div>
    </Layout>
  );
}
