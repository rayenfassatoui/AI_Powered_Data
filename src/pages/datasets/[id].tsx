import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';
import { FiEdit2, FiDownload, FiTrash2, FiSearch, FiChevronLeft, FiSave, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import DataCleaner from '@/components/DataCleaner';

interface Dataset {
  id: string;
  name: string;
  type: string;
  data: any[];
  createdAt: string;
  userId: string;
}

export default function DatasetDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 10;
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; column: string } | null>(null);
  const [editedValue, setEditedValue] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
  }, [status, router]);

  useEffect(() => {
    if (dataset) {
      setEditedName(dataset.name);
    }
  }, [dataset]);

  useEffect(() => {
    async function fetchDataset() {
      if (!id || !session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/datasets/${id}`);
        
        if (response.status === 404) {
          setError('Dataset not found');
          return;
        }
        
        if (response.status === 403) {
          setError('You do not have permission to view this dataset');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch dataset');
        }
        
        const data = await response.json();
        console.log('Fetched dataset:', {
          id: data.id,
          name: data.name,
          rowCount: data.data?.length || 0,
          columnCount: Object.keys(data.data?.[0] || {}).length || 0,
          firstRow: data.data?.[0]
        });
        setDataset(data);
      } catch (err) {
        console.error('Error fetching dataset:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchDataset();
  }, [id, session?.user?.id]);

  const filteredData = dataset?.data ? dataset.data.filter(row => 
    Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : [];

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this dataset?')) return;

    try {
      const response = await fetch(`/api/datasets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete dataset');
      }

      router.push('/datasets');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete dataset');
    }
  };

  const handleDownload = () => {
    if (!dataset) return;

    const csvContent = [
      Object.keys(dataset.data[0] || {}).join(','),
      ...dataset.data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.name}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleEdit = async () => {
    if (!dataset || !editedName.trim()) return;

    try {
      const response = await fetch(`/api/datasets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update dataset');
      }

      const updatedDataset = await response.json();
      setDataset(updatedDataset);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating dataset');
    }
  };

  const handleCellEdit = async (rowIndex: number, column: string, newValue: string) => {
    if (!dataset) return;

    try {
      // Create a copy of the data
      const newData = [...dataset.data];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [column]: newValue
      };

      // Update the dataset through the API
      const response = await fetch(`/api/datasets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: newData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update dataset');
      }

      const updatedDataset = await response.json();
      // Update local state with the full updated dataset
      setDataset(updatedDataset);
      setEditingCell(null);
      setError(null);
    } catch (err) {
      console.error('Error updating dataset:', err);
      setError(err instanceof Error ? err.message : 'Error updating dataset');
    }
  };

  const handleDataCleaned = async (cleanedData: any[]) => {
    try {
      const response = await fetch(`/api/datasets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: cleanedData }),
      });

      if (!response.ok) {
        throw new Error('Failed to update dataset');
      }

      // Refresh the dataset
      const updatedDataset = await response.json();
      setDataset(updatedDataset);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update dataset');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            className="flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-200 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="ml-4 text-lg text-gray-600">Loading dataset...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {error}
          </motion.div>
          <div className="mt-4">
            <Link href="/datasets" className="text-blue-600 hover:text-blue-800">
              ← Back to datasets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p>Dataset not found</p>
          <div className="mt-4">
            <Link href="/datasets" className="text-blue-600 hover:text-blue-800">
              ← Back to datasets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{dataset?.name || 'Dataset Details'}</title>
      </Head>

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {error}
          </motion.div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div 
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full text-2xl font-bold px-4 py-2 pr-10 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                        placeholder="Dataset name"
                      />
                      <FiEdit2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEdit}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiSave className="w-4 h-4 mr-2" />
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsEditing(false);
                        setEditedName(dataset?.name || '');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Cancel
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h1 className="text-2xl font-bold text-gray-900">{dataset?.name}</h1>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Download CSV
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                Delete Dataset
              </motion.button>
            </div>
          </div>

          <motion.div 
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/datasets" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <FiChevronLeft className="w-4 h-4 mr-1" />
              Back to datasets
            </Link>
          </motion.div>
        </div>

        <motion.div 
          className="bg-white backdrop-blur-lg bg-opacity-80 shadow-lg rounded-2xl border border-gray-200/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search data..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all duration-200"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead>
                  <tr>
                    {dataset?.data[0] && Object.keys(dataset.data[0]).map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/50"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  <AnimatePresence>
                    {paginatedData.map((row, rowIndex) => (
                      <motion.tr 
                        key={rowIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: rowIndex * 0.05 }}
                        className="hover:bg-gray-50/50 transition-colors duration-150"
                      >
                        {Object.entries(row).map(([column, value], colIndex) => (
                          <td
                            key={colIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            onClick={() => {
                              setEditingCell({ rowIndex: (currentPage - 1) * rowsPerPage + rowIndex, column });
                              setEditedValue(String(value));
                            }}
                          >
                            <AnimatePresence mode="wait">
                              {editingCell?.rowIndex === (currentPage - 1) * rowsPerPage + rowIndex && 
                               editingCell.column === column ? (
                                <motion.div 
                                  className="flex items-center gap-2"
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                >
                                  <input
                                    type="text"
                                    value={editedValue}
                                    onChange={(e) => setEditedValue(e.target.value)}
                                    className="block w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleCellEdit(
                                          (currentPage - 1) * rowsPerPage + rowIndex,
                                          column,
                                          editedValue
                                        );
                                      } else if (e.key === 'Escape') {
                                        setEditingCell(null);
                                      }
                                    }}
                                    onBlur={() => {
                                      handleCellEdit(
                                        (currentPage - 1) * rowsPerPage + rowIndex,
                                        column,
                                        editedValue
                                      );
                                    }}
                                  />
                                </motion.div>
                              ) : (
                                <motion.div 
                                  className="cursor-pointer hover:bg-gray-100/50 px-3 py-1.5 rounded-lg transition-colors duration-150"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  {String(value)}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {filteredData.length > rowsPerPage && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {(currentPage - 1) * rowsPerPage + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * rowsPerPage, filteredData.length)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">{filteredData.length}</span>{' '}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        First
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        Last
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="bg-white shadow rounded-lg p-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Cleaning</h2>
          <DataCleaner 
            data={dataset?.data || []} 
            onDataCleaned={handleDataCleaned} 
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
