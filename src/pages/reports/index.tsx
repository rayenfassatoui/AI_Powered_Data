import Layout from '@/components/Layout';
import { FiDownload, FiShare2, FiEdit } from 'react-icons/fi';

export default function Reports() {
  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <button className="btn-primary">Create New Report</button>
        </div>

        <div className="grid gap-6">
          {/* Report Card */}
          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Q4 2023 Sales Analysis</h3>
                <p className="text-gray-700 mb-4">Comprehensive analysis of Q4 sales performance and trends</p>
                <div className="flex gap-2">
                  <span className="badge badge-info">Sales</span>
                  <span className="badge badge-success">Complete</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" title="Download">
                  <FiDownload className="h-5 w-5 text-gray-700" />
                </button>
                <button className="btn-secondary" title="Share">
                  <FiShare2 className="h-5 w-5 text-gray-700" />
                </button>
                <button className="btn-secondary" title="Edit">
                  <FiEdit className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Customer Segmentation Report</h3>
                <p className="text-gray-700 mb-4">Analysis of customer segments and behavior patterns</p>
                <div className="flex gap-2">
                  <span className="badge badge-info">Marketing</span>
                  <span className="badge badge-warning">In Progress</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" title="Download">
                  <FiDownload className="h-5 w-5 text-gray-700" />
                </button>
                <button className="btn-secondary" title="Share">
                  <FiShare2 className="h-5 w-5 text-gray-700" />
                </button>
                <button className="btn-secondary" title="Edit">
                  <FiEdit className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Product Performance Metrics</h3>
                <p className="text-gray-700 mb-4">Detailed analysis of product performance and metrics</p>
                <div className="flex gap-2">
                  <span className="badge badge-info">Products</span>
                  <span className="badge badge-success">Complete</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" title="Download">
                  <FiDownload className="h-5 w-5 text-gray-700" />
                </button>
                <button className="btn-secondary" title="Share">
                  <FiShare2 className="h-5 w-5 text-gray-700" />
                </button>
                <button className="btn-secondary" title="Edit">
                  <FiEdit className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
