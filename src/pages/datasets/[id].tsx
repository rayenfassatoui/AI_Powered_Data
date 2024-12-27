import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import {
  FiDownload,
  FiTrash2,
  FiArrowLeft,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiEdit3,
  FiDatabase,
  FiGrid,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiAlertCircle,
} from 'react-icons/fi';
import Link from 'next/link';

interface DataItem {
  [key: string]: any;
}

export default function DatasetDetailPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { id } = router.query;
  const [dataset, setDataset] = useState<{ name: string; data: DataItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isCleaningData, setIsCleaningData] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (id) {
      fetchDataset();
    }
  }, [id, status]);

  const fetchDataset = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/datasets/${id}`);
      if (!response.ok) throw new Error('Failed to fetch dataset');
      const data = await response.json();
      setDataset(data);
      if (data.data.length > 0) {
        setSelectedColumns(Object.keys(data.data[0]));
      }
    } catch (err) {
      console.error('Error fetching dataset:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dataset');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," + 
        selectedColumns.join(",") + "\\n" +
        dataset?.data.map(row => 
          selectedColumns.map(key => row[key]).join(",")
        ).join("\\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${dataset?.name || 'dataset'}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download dataset');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this dataset?')) return;

    try {
      const response = await fetch(`/api/datasets/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete dataset');
      router.push('/datasets');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete dataset');
    }
  };

  const handleCleanData = async () => {
    try {
      setIsCleaningData(true);
      // Add your data cleaning logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated delay
      setIsCleaningData(false);
    } catch (err) {
      setError('Failed to clean data');
      setIsCleaningData(false);
    }
  };

  const filteredData = dataset?.data.filter(item =>
    Object.entries(item).some(([key, value]) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredData;

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link
                href="/datasets"
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <FiArrowLeft className="h-5 w-5 mr-2" />
                Back to datasets
              </Link>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                {dataset?.name || 'Dataset Details'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <FiDownload className="mr-2" />
                Download CSV
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <FiTrash2 className="mr-2" />
                Delete Dataset
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700"
            >
              <FiAlertCircle className="h-5 w-5 mr-2" />
              {error}
            </motion.div>
          )}

          {/* Tools Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedColumns(Object.keys(dataset?.data[0] || {}))}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <FiGrid className="mr-2" />
                  Show All Columns
                </button>
                <button
                  onClick={handleCleanData}
                  disabled={isCleaningData}
                  className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                    isCleaningData ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isCleaningData ? (
                    <FiRefreshCw className="mr-2 animate-spin" />
                  ) : (
                    <FiEdit3 className="mr-2" />
                  )}
                  Clean Data
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {selectedColumns.map((column) => (
                      <th
                        key={column}
                        onClick={() => handleSort(column)}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column}</span>
                          {sortConfig?.key === column && (
                            <span className="text-blue-600">
                              {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      {selectedColumns.map((column) => (
                        <td
                          key={column}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {String(item[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of{' '}
                  {sortedData.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <FiChevronsLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <FiChevronsRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
