import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiDatabase, FiBarChart2, FiUpload } from 'react-icons/fi';

const Sidebar = () => {
  const router = useRouter();

  const navigation = [
    {
      name: 'Datasets',
      href: '/datasets',
      icon: FiDatabase,
      current: router.pathname.startsWith('/datasets'),
    },
    {
      name: 'Upload',
      href: '/upload',
      icon: FiUpload,
      current: router.pathname.startsWith('/upload'),
    },
    {
      name: 'Visualizations',
      href: '/visualizations',
      icon: FiBarChart2,
      current: router.pathname.startsWith('/visualizations'),
    },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              DataViz
            </Link>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${
                    item.current
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 flex-shrink-0 h-6 w-6
                    ${
                      item.current
                        ? 'text-blue-600'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }
                  `}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
