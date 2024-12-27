import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload,
  FiFile,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiLoader,
  FiDatabase,
  FiGrid,
  FiCpu,
} from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';

interface FileWithPreview extends File {
  preview?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
    setError(null);
    setUploadSuccess(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    multiple: false
  });

  const uploadFile = async () => {
    if (files.length === 0) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append('file', files[0]);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      setUploadSuccess(true);
      setTimeout(() => {
        router.push('/datasets');
      }, 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFiles([]);
    setError(null);
    setUploadSuccess(false);
  };

  // Simulate upload progress
  useEffect(() => {
    if (uploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [uploading]);

  const features = [
    {
      icon: FiDatabase,
      title: "Data Processing",
      description: "Automatic processing and validation of your datasets with advanced algorithms"
    },
    {
      icon: FiGrid,
      title: "Format Support",
      description: "Comprehensive support for CSV and Excel file formats with intelligent parsing"
    },
    {
      icon: FiCpu,
      title: "Smart Analysis",
      description: "Advanced data analysis and automatic schema detection for your datasets"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
            >
              Upload Your Dataset
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-xl text-gray-600"
            >
              Drag and drop your CSV or Excel file to get started
            </motion.p>
          </div>

          {/* Upload Zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 text-center ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-blue-100 p-4">
                    <FiUpload className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="text-gray-600">
                  {isDragActive ? (
                    <p className="text-blue-600 font-medium">Drop your file here</p>
                  ) : (
                    <>
                      <p className="font-medium">Drop your file here, or browse</p>
                      <p className="text-sm mt-2">Supports CSV and Excel files</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* File Preview */}
          <AnimatePresence mode="wait">
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FiFile className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{files[0].name}</p>
                      <p className="text-sm text-gray-500">
                        {(files[0].size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                {uploading && (
                  <div className="mt-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700"
              >
                <FiAlertCircle className="h-5 w-5 mr-2" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center text-green-700"
              >
                <FiCheckCircle className="h-5 w-5 mr-2" />
                File uploaded successfully! Redirecting to datasets...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <button
              onClick={uploadFile}
              disabled={files.length === 0 || uploading}
              className={`inline-flex items-center px-6 py-3 rounded-xl font-medium shadow-lg transform transition-all duration-200 ${
                files.length === 0 || uploading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:scale-105'
              }`}
            >
              {uploading ? (
                <FiLoader className="animate-spin h-5 w-5 mr-2" />
              ) : (
                <FiUpload className="h-5 w-5 mr-2" />
              )}
              {uploading ? 'Uploading...' : 'Upload Dataset'}
            </button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
} 