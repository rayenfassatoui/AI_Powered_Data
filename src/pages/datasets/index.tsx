import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiDatabase, 
  FiUpload, 
  FiGrid, 
  FiDownload, 
  FiSearch, 
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiCalendar,
  FiPackage,
  FiAlertCircle
} from "react-icons/fi";
import Link from "next/link";
import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';

interface Dataset {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  size?: string;
  data?: any[];
}

export default function DatasetsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    fetchDatasets();
  }, [status, router]);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/datasets');
      if (!response.ok) throw new Error('Failed to fetch datasets');
      const data = await response.json();
      setDatasets(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching datasets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch datasets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (datasetId: string) => {
    if (!confirm('Are you sure you want to delete this dataset?')) return;

    try {
      setIsDeleting(datasetId);
      const response = await fetch(`/api/datasets/${datasetId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete dataset');
      
      setDatasets(prev => prev.filter(d => d.id !== datasetId));
      setError(null);
    } catch (err) {
      console.error('Error deleting dataset:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete dataset');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDownload = async (dataset: Dataset) => {
    try {
      const response = await fetch(`/api/datasets/${dataset.id}`);
      if (!response.ok) throw new Error('Failed to fetch dataset data');
      
      const result = await response.json();
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(result.data);
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `${dataset.name}.xlsx`);
    } catch (err) {
      console.error('Error downloading dataset:', err);
      setError(err instanceof Error ? err.message : 'Failed to download dataset');
    }
  };

  const filteredAndSortedDatasets = datasets
    .filter(dataset => {
      const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || dataset.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return (b.size || '0').localeCompare(a.size || '0');
        default:
          return 0;
      }
    });

  const calculateStorageUsed = () => {
    const totalSize = datasets.reduce((acc, dataset) => {
      const size = dataset.size ? parseFloat(dataset.size) : 0;
      return acc + size;
    }, 0);
    return `${totalSize.toFixed(1)} MB Used`;
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
          className="max-w-7xl mx-auto mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Dataset Management
              </h1>
              <p className="mt-2 text-xl text-gray-600">
                Your Data Hub
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <FiUpload className="mr-2" />
              Upload New Dataset
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: FiDatabase, label: "Storage", value: calculateStorageUsed() },
              { icon: FiUpload, label: "Datasets", value: datasets.length.toString() },
              { icon: FiGrid, label: "Types", value: Array.from(new Set(datasets.map(d => d.type))).length.toString() },
              { icon: FiDownload, label: "Export", value: "Multiple Formats" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Types</option>
                {Array.from(new Set(datasets.map(d => d.type))).map(type => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
              </select>
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

          {/* Datasets Grid */}
          <AnimatePresence mode="popLayout">
            {filteredAndSortedDatasets.length > 0 ? (
              <div className="grid gap-6">
                {filteredAndSortedDatasets.map((dataset, index) => (
                  <motion.div
                    key={dataset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                    <div className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <FiFileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{dataset.name}</h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="inline-flex items-center text-sm text-gray-500">
                                <FiPackage className="mr-1" /> {dataset.type.toUpperCase()}
                              </span>
                              <span className="inline-flex items-center text-sm text-gray-500">
                                <FiCalendar className="mr-1" /> Updated {dataset.updatedAt ? format(parseISO(dataset.updatedAt), 'MMM d, yyyy') : 'Never'}
                              </span>
                              {dataset.size && (
                                <span className="inline-flex items-center text-sm text-gray-500">
                                  {dataset.size}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/datasets/${dataset.id}`}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDownload(dataset)}
                            className="p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                          >
                            <FiDownload className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(dataset.id)}
                            disabled={isDeleting === dataset.id}
                            className={`p-2 text-gray-600 hover:text-red-600 transition-colors duration-200 ${
                              isDeleting === dataset.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {isDeleting === dataset.id ? (
                              <div className="animate-spin h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full" />
                            ) : (
                              <FiTrash2 className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/30 mb-6">
                  <FiDatabase className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No datasets found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search or filter criteria' : 'Get started by uploading a new dataset'}
                </p>
                {!searchTerm && (
                  <Link
                    href="/upload"
                    className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <FiUpload className="mr-2" />
                    Upload Dataset
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
}
