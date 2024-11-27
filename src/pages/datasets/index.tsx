import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiDownload, FiTrash2, FiGrid, FiList, FiSearch, FiFilter, FiDatabase, FiCalendar, FiColumns, FiChevronDown } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

interface Dataset {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  rowCount?: number;
  columnCount?: number;
}

export default function DatasetsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [filterType, setFilterType] = useState<string>('all');
  const [exportingDataset, setExportingDataset] = useState<string | null>(null);

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
      setExportingDataset(dataset.id);
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
      setExportingDataset(null);
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

  return (
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
                <input
                  type="text"
                  placeholder="Search datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all duration-200 group-hover:bg-white"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
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
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="relative bg-white backdrop-blur-lg bg-opacity-80 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-6 z-10">
                      {/* Dataset Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-500/30 rounded-xl"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <FiDatabase className="w-6 h-6 text-blue-600" />
                          </motion.div>
                          <div>
                            <motion.h3 
                              className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200"
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
                          className="px-4 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-50 via-blue-100/50 to-blue-50 text-blue-700 rounded-full border border-blue-200/50 shadow-sm"
                          whileHover={{ scale: 1.05 }}
                          layout
                        >
                          {dataset.type.toUpperCase()}
                        </motion.span>
                      </div>

                      {/* Dataset Info */}
                      <div className="space-y-4 mb-6">
                        <motion.div 
                          className="flex items-center text-sm text-gray-600 bg-gray-50/50 rounded-lg p-2.5 group-hover:bg-gray-100/50 transition-colors duration-200"
                          whileHover={{ x: 5 }}
                        >
                          <FiCalendar className="w-4 h-4 mr-2 text-blue-500" />
                          <span>Updated {dataset.updatedAt ? format(parseISO(dataset.updatedAt), 'MMM d, yyyy') : 'Never'}</span>
                        </motion.div>
                        {dataset.rowCount && dataset.columnCount && (
                          <motion.div 
                            className="flex items-center text-sm text-gray-600 bg-gray-50/50 rounded-lg p-2.5 group-hover:bg-gray-100/50 transition-colors duration-200"
                            whileHover={{ x: 5 }}
                          >
                            <FiColumns className="w-4 h-4 mr-2 text-blue-500" />
                            <span>{dataset.rowCount.toLocaleString()} rows × {dataset.columnCount.toLocaleString()} columns</span>
                          </motion.div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="relative w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
                        <motion.div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${Math.min((dataset.rowCount || 0) / 1000 * 100, 100)}%`,
                            transition: { duration: 1, ease: "easeOut" }
                          }}
                        />
                        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-white/0 via-white/50 to-white/0 animate-shimmer" />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => router.push(`/datasets/${dataset.id}`)}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-blue-200/50 shadow-sm text-sm font-medium rounded-xl text-blue-700 bg-gradient-to-b from-white to-blue-50 hover:from-blue-50 hover:to-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all duration-200"
                        >
                          <FiEdit2 className="w-4 h-4 mr-2" />
                          Edit
                        </motion.button>

                        <div className="relative flex-1">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setExportingDataset(dataset.id)}
                            className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-green-200/50 shadow-sm text-sm font-medium rounded-xl text-green-700 bg-gradient-to-b from-white to-green-50 hover:from-green-50 hover:to-green-100 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/20 transition-all duration-200"
                          >
                            <FiDownload className={`w-4 h-4 mr-2 ${exportingDataset === dataset.id ? 'animate-spin' : ''}`} />
                            Export
                            <motion.div
                              animate={{ rotate: exportingDataset === dataset.id ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FiChevronDown className="ml-2 w-4 h-4" />
                            </motion.div>
                          </motion.button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDelete(dataset.id)}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-red-200/50 shadow-sm text-sm font-medium rounded-xl text-red-700 bg-gradient-to-b from-white to-red-50 hover:from-red-50 hover:to-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/20 transition-all duration-200"
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
  );
}
