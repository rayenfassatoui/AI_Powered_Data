import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiDownload, FiTrash2, FiGrid, FiList, FiSearch, FiFilter, FiDatabase, FiCalendar, FiColumns, FiChevronDown } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';

interface Dataset {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  rowCount?: number;
  columnCount?: number;
  data?: any[];
}

const exportToExcel = (data: any[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

const exportToCSV = (data: any[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default function DatasetsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [filterType, setFilterType] = useState<string>('all');
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
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
      setError(err instanceof Error ? err.message : 'Error fetching datasets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (datasetId: string) => {
    if (!confirm('Are you sure you want to delete this dataset?')) return;

    try {
      const response = await fetch(`/api/datasets/${datasetId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete dataset');
      await fetchDatasets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting dataset');
    }
  };

  const handleExport = async (dataset: Dataset, format: 'csv' | 'json' | 'excel') => {
    try {
      setSelectedDataset(dataset);
      const response = await fetch(`/api/datasets/${dataset.id}/export?format=${format}`, {
        method: 'GET',
        headers: {
          'Accept': format === 'json' ? 'application/json' : 
                   format === 'csv' ? 'text/csv' : 
                   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export dataset');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataset.name}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setError(null);
    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err.message : 'Error exporting dataset');
    } finally {
      setSelectedDataset(null);
    }
  };

  const handleDatasetSelect = async (datasetId: string) => {
    try {
      const response = await fetch(`/api/datasets/${datasetId}`);
      if (!response.ok) throw new Error('Failed to fetch dataset data');
      const result = await response.json();
      
      const dataset = datasets.find(d => d.id === datasetId);
      if (dataset) {
        setSelectedDataset({ ...dataset, data: result.data });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dataset data');
    }
  };

  const filteredDatasets = datasets
    .filter(dataset => {
      const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || dataset.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const uniqueTypes = Array.from(new Set(datasets.map(d => d.type)));

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
    router.push('/auth/signin');
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Datasets</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage and analyze your datasets
            </p>
          </div>

          {/* Controls */}
          <div className="mb-6 bg-white backdrop-blur-lg bg-opacity-80 rounded-2xl border border-gray-200/50 shadow-lg p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0 group">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search datasets..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 
                        text-gray-900 dark:text-gray-900 
                        placeholder-gray-500 
                        bg-white
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-200/50 rounded-xl py-2.5 px-4 text-sm bg-gray-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 hover:bg-white transition-all duration-200"
                >
                  <option value="all">All Types</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
                  className="border border-gray-200/50 rounded-xl py-2.5 px-4 text-sm bg-gray-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 hover:bg-white transition-all duration-200"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                </select>

                <div className="flex items-center gap-1 bg-gray-50/50 p-1 rounded-xl border border-gray-200/50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-200 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div 
                className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
                layout
              >
                {filteredDatasets.map((dataset) => (
                  <motion.div
                    key={dataset.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group"
                  >
                    <div className="relative bg-white backdrop-blur-xl bg-opacity-90 rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-green-500/10 via-blue-500/10 to-purple-500/10 blur-3xl transform -rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative p-6 z-10">
                        {/* Dataset Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <motion.div 
                              className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/30 rounded-xl shadow-lg shadow-blue-500/20"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <FiDatabase className="w-6 h-6 text-blue-600" />
                            </motion.div>
                            <div>
                              <motion.h3 
                                className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300"
                                layout
                              >
                                {dataset.name}
                              </motion.h3>
                              <p className="text-sm text-gray-500">
                                {dataset.type}
                              </p>
                            </div>
                          </div>
                          <motion.span 
                            className="px-4 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-indigo-700 rounded-full border border-indigo-100/50 shadow-sm"
                            whileHover={{ scale: 1.05 }}
                            layout
                          >
                            {dataset.type.toUpperCase()}
                          </motion.span>
                        </div>

                        {/* Dataset Info */}
                        <div className="space-y-4 mb-6">
                          <motion.div 
                            className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-colors duration-300 shadow-sm"
                            whileHover={{ x: 5 }}
                          >
                            <FiCalendar className="w-4 h-4 mr-2 text-indigo-500" />
                            <span>Updated {dataset.updatedAt ? format(parseISO(dataset.updatedAt), 'MMM d, yyyy') : 'Never'}</span>
                          </motion.div>
                          {dataset.rowCount && dataset.columnCount && (
                            <motion.div 
                              className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-colors duration-300 shadow-sm"
                              whileHover={{ x: 5 }}
                            >
                              <FiColumns className="w-4 h-4 mr-2 text-indigo-500" />
                              <span>{dataset.rowCount.toLocaleString()} rows × {dataset.columnCount.toLocaleString()} columns</span>
                            </motion.div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="relative w-full h-2.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
                          <motion.div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${Math.min((dataset.rowCount || 0) / 1000 * 100, 100)}%`,
                              transition: { duration: 1.5, ease: "easeOut" }
                            }}
                          />
                          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-white/0 via-white/50 to-white/0 animate-shimmer" />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push(`/datasets/${dataset.id}`)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-blue-200/50 shadow-md text-sm font-medium rounded-xl text-blue-700 bg-gradient-to-br from-white via-blue-50 to-blue-100/50 hover:from-blue-50 hover:via-blue-100 hover:to-indigo-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all duration-300"
                          >
                            <FiEdit2 className="w-4 h-4 mr-2" />
                            Edit
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={async () => {
                              try {
                                const response = await fetch(`/api/datasets/${dataset.id}`);
                                if (!response.ok) throw new Error('Failed to fetch dataset');
                                const result = await response.json();
                                exportToExcel(result.data, dataset.name);
                              } catch (err) {
                                console.error('Download error:', err);
                                setError(err instanceof Error ? err.message : 'Error downloading dataset');
                              }
                            }}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-green-200/50 shadow-md text-sm font-medium rounded-xl text-green-700 bg-gradient-to-br from-white via-green-50 to-green-100/50 hover:from-green-50 hover:via-green-100 hover:to-emerald-100 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/20 transition-all duration-300"
                          >
                            <FiDownload className="w-4 h-4 mr-2" />
                            Download Excel
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleDelete(dataset.id)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-red-200/50 shadow-md text-sm font-medium rounded-xl text-red-700 bg-gradient-to-br from-white via-red-50 to-red-100/50 hover:from-red-50 hover:via-red-100 hover:to-pink-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/20 transition-all duration-300"
                          >
                            <FiTrash2 className="w-4 h-4 mr-2" />
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
          {!loading && filteredDatasets.length === 0 && (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No datasets found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search or filter criteria' : 'Get started by creating a new dataset'}
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => router.push('/upload')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload Dataset
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
