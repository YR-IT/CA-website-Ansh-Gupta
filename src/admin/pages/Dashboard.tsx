import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  BookOpen,
  MessageSquare,
  Eye,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../components/AdminLayout';

interface Stats {
  servicesCount: number;
  blogsCount: number;
  contactsCount: number;
  unreadContacts: number;
  recentContacts: any[];
  recentBlogs: any[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-blue-600"
          />
        </div>
      </AdminLayout>
    );
  }

  const statsCards = [
    {
      label: 'Total Services',
      value: stats?.servicesCount || 0,
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      link: '/admin/services'
    },
    {
      label: 'Total Blogs',
      value: stats?.blogsCount || 0,
      icon: BookOpen,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      link: '/admin/blogs'
    },
    {
      label: 'Total Contacts',
      value: stats?.contactsCount || 0,
      icon: MessageSquare,
      color: 'purple',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      link: '/admin/contacts'
    },
    {
      label: 'Unread Messages',
      value: stats?.unreadContacts || 0,
      icon: TrendingUp,
      color: 'red',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      link: '/admin/contacts'
    }
  ];

  return (
    <AdminLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Welcome to the admin panel</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} to={stat.link}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 cursor-pointer hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs sm:text-sm">{stat.label}</p>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                        className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1"
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className={`${stat.bgColor} p-2 sm:p-3 rounded-lg`}
                    >
                      <Icon className={stat.textColor} size={20} />
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Contacts */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
          >
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Recent Contacts
                </h2>
                <Link
                  to="/admin/contacts"
                  className="text-blue-600 text-xs sm:text-sm hover:text-blue-700 flex items-center gap-1 transition-colors whitespace-nowrap"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {stats?.recentContacts?.length ? (
                stats.recentContacts.map((contact: any, index: number) => (
                  <motion.div
                    key={contact._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                    className="p-3 sm:p-4 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{contact.name}</p>
                          {!contact.isRead && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                            >
                              New
                            </motion.span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{contact.subject}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                        <Clock size={12} />
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No recent contacts
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Blogs */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
          >
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Recent Blogs
                </h2>
                <Link
                  to="/admin/blogs"
                  className="text-blue-600 text-xs sm:text-sm hover:text-blue-700 flex items-center gap-1 transition-colors whitespace-nowrap"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {stats?.recentBlogs?.length ? (
                stats.recentBlogs.map((blog: any, index: number) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                    className="p-3 sm:p-4 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{blog.title}</p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
                        <Eye size={14} />
                        <span className="text-xs sm:text-sm">{blog.views || 0}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No recent blogs
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/admin/services/new"
                className="bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 w-full"
              >
                <Plus size={18} />
                <span>Add New Service</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/admin/blogs/new"
                className="bg-blue-800 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 w-full"
              >
                <Plus size={18} />
                <span>Create Blog Post</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="sm:col-span-2 lg:col-span-1">
              <Link
                to="/admin/contacts"
                className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 w-full"
              >
                <MessageSquare size={18} />
                <span>View Messages</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
