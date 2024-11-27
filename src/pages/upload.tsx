import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import FileUpload from '@/components/FileUpload';

export default function Upload() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

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
    return null;
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result as string;
        const fileType = file.name.split('.').pop()?.toLowerCase();

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileContent: fileContent.split('base64,')[1],
              fileName: file.name,
              fileType,
            }),
            credentials: 'include', // Add this to include cookies
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to upload file' }));
            throw new Error(errorData.message || 'Failed to upload file');
          }

          const data = await response.json();
          router.push(`/datasets/${data.id}`);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred during upload');
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Dataset</h1>
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Select File</h2>
            <FileUpload onUpload={handleUpload} />
            {isUploading && (
              <p className="mt-4 text-sm text-gray-600">Uploading file...</p>
            )}
            {error && (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Supported Formats</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>CSV (Comma Separated Values)</li>
              <li>Excel Spreadsheets (XLSX, XLS)</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              Maximum file size: 10MB
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
