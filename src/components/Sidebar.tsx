import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiUpload, FiDatabase, FiBarChart2, FiFileText } from 'react-icons/fi';

export default function Sidebar() {
  const router = useRouter();
  const currentPath = router.pathname;

  const menuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/' },
    { name: 'Upload Data', icon: FiUpload, path: '/upload' },
    { name: 'Datasets', icon: FiDatabase, path: '/datasets' },
    { name: 'Visualizations', icon: FiBarChart2, path: '/visualizations' },
    { name: 'Reports', icon: FiFileText, path: '/reports' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="mt-5 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
