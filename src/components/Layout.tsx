import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-16"> 
        <Sidebar />
        <main className="flex-1 bg-gradient-to-b from-white to-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
