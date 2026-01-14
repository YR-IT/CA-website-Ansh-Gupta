import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  HelpCircle,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/services', label: 'Services', icon: FileText },
  { path: '/admin/blogs', label: 'Blogs', icon: BookOpen },
  { path: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { path: '/admin/aboutus', label: 'About Us', icon: Info },
  { path: '/admin/contacts', label: 'Contact Submissions', icon: MessageSquare }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop: always visible, Mobile: toggleable */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white z-50 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-blue-800">
          <h1 className="text-xl font-bold">A S GUPTA AND CO</h1>
          <p className="text-blue-300 text-sm">Admin Panel</p>
        </div>

        {/* Close button (mobile) */}
        <button
          className="lg:hidden absolute top-4 right-4 text-white hover:text-blue-200 transition"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                (item.path === '/admin/services' && location.pathname.startsWith('/admin/services')) ||
                (item.path === '/admin/blogs' && location.pathname.startsWith('/admin/blogs')) ||
                (item.path === '/admin/faqs' && location.pathname.startsWith('/admin/faqs'));

              return (
                <motion.li
                  key={item.path}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={menuItemVariants}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-blue-800 text-white'
                        : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-blue-200 hover:bg-blue-800 hover:text-white rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900 transition"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Page Title */}
            <h2 className="text-lg font-semibold text-gray-800 hidden lg:block">
              {menuItems.find((item) => location.pathname.startsWith(item.path))?.label || 'Admin Panel'}
            </h2>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <User size={18} />
                </div>
                <span className="hidden sm:inline">{admin?.name || 'Admin'}</span>
                <ChevronDown size={16} className={`transform transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
                      <p className="text-xs text-gray-500">{admin?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 lg:p-6"
        >
          {children}
        </motion.main>
      </div>

      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}
