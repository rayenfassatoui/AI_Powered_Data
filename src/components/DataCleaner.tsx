import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiRefreshCw, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useRouter } from 'next/router';

interface DataCleanerProps {
  data: any[];
  datasetId: string;
  onDataCleaned?: (data: any[]) => void;
}

export default function DataCleaner({ data, datasetId, onDataCleaned }: DataCleanerProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const handleCleanData = async () => {
    if (!session) {
      setError('Please sign in to use the data cleaning feature');
      return;
    }

    if (!datasetId) {
      setError('Dataset ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await fetch('/api/clean-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          datasetId: datasetId
        }),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to clean data');
      }

      setSummary(result.summary);
      if (onDataCleaned) {
        onDataCleaned(result.data);
      }

      // Show success message and offer to view the cleaned dataset
      const viewCleanedDataset = window.confirm(
        'Data cleaned successfully! Would you like to view the cleaned dataset?'
      );
      
      if (viewCleanedDataset) {
        router.push(`/datasets/${result.cleanedDatasetId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clean data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Data Cleaning</h3>
        <button
          onClick={handleCleanData}
          disabled={isLoading || !session || !datasetId}
          className={`
            inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
            ${
              !session || !datasetId
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : isLoading
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }
          `}
        >
          {isLoading ? (
            <>
              <FiRefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Cleaning...
            </>
          ) : (
            <>
              <FiRefreshCw className="-ml-1 mr-2 h-4 w-4" />
              Clean Data
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <FiAlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {summary && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <FiCheck className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Data Cleaned Successfully</h3>
              <div className="mt-2 text-sm text-green-700 whitespace-pre-wrap">{summary}</div>
            </div>
          </div>
        </div>
      )}

      {!session && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <FiAlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Authentication Required</h3>
              <div className="mt-2 text-sm text-yellow-700">
                Please sign in to use the data cleaning feature.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
