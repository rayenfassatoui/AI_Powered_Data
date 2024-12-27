import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiFile, FiCheckCircle, FiX, FiDatabase } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!allowedTypes.includes(file.type) && 
        !file.name.endsWith('.csv') && 
        !file.name.endsWith('.xlsx') && 
        !file.name.endsWith('.xls')) {
      setError("Please upload a CSV or Excel file");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError("File size must be less than 10MB");
      return;
    }
    
    setFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      
      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      let result;
      try {
        const responseText = await response.text();
        console.log('Response:', {
          status: response.status,
          text: responseText
        });
        
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(result?.message || 'Upload failed');
      }

      console.log('Upload successful:', result);
      router.push('/datasets');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Upload Your Dataset
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Drag and drop your CSV or Excel file to get started
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-green-500/10 via-blue-500/10 to-purple-500/10 blur-3xl rounded-full"></div>

            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 bg-white/80 backdrop-blur-xl shadow-xl ${
                dragActive
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
                id="file-upload"
              />

              <label
                htmlFor="file-upload"
                className="relative block cursor-pointer group"
              >
                <div className="text-center">
                  <motion.div
                    className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/30 shadow-lg shadow-blue-500/20"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {file ? (
                      <FiCheckCircle className="h-12 w-12 text-blue-600" />
                    ) : (
                      <FiUpload className="h-12 w-12 text-blue-600" />
                    )}
                  </motion.div>

                  <motion.div 
                    className="mt-6"
                    initial={false}
                    animate={{ opacity: 1 }}
                  >
                    {file ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                          <FiFile className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {file.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setFile(null);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </div>
                        <Button
                          onClick={handleUpload}
                          disabled={uploading}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30"
                        >
                          {uploading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <FiUpload className="mr-2 h-5 w-5" />
                              Upload Dataset
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-lg font-medium text-gray-900">
                          Drop your file here, or{" "}
                          <span className="text-blue-600">browse</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports CSV and Excel files
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </label>
            </div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[
                {
                  icon: FiDatabase,
                  title: "Data Processing",
                  description: "Automatic processing and validation of your datasets"
                },
                {
                  icon: FiCheckCircle,
                  title: "Format Support",
                  description: "Support for CSV and Excel file formats"
                },
                {
                  icon: FiUpload,
                  title: "Easy Upload",
                  description: "Simple drag and drop interface for quick uploads"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-2xl rounded-full"></div>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/30 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200"
            >
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
