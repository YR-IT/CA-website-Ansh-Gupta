import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import Pagination from '../../components/Pagination';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  icon: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  const fetchServices = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getServices(page, limit);
      setServices(response.data.data);
      setTotalPages(response.data.pages);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await adminAPI.deleteService(id);
      fetchServices(currentPage);
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your services</p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/admin/services/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition w-full sm:w-auto"
            >
              <Plus size={20} />
              Add Service
            </Link>
          </motion.div>
        </motion.div>

        {/* Services List */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-12 w-12 border-b-2 border-blue-600"
              />
            </div>
          ) : services.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center"
            >
              <p className="text-gray-500 mb-4">No services found</p>
              <Link
                to="/admin/services/new"
                className="text-blue-600 hover:underline"
              >
                Create your first service
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                        Title
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                        Description
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                        Order
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <AnimatePresence>
                      {services.map((service, index) => (
                        <motion.tr
                          key={service._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.03)' }}
                          className="transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {service.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              /{service.slug}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                            {service.shortDescription}
                          </td>
                          <td className="px-6 py-4">
                            {service.isActive ? (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                              >
                                <Eye size={12} />
                                Active
                              </motion.span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                <EyeOff size={12} />
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {service.order}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Link
                                  to={`/admin/services/${service._id}/edit`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition block"
                                >
                                  <Edit size={18} />
                                </Link>
                              </motion.div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(service._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 size={18} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y">
                <AnimatePresence>
                  {services.map((service, index) => (
                    <motion.div
                      key={service._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium text-gray-900 text-sm">
                              {service.title}
                            </h3>
                            {service.isActive ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <Eye size={10} />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                <EyeOff size={10} />
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">/{service.slug}</p>
                          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                            {service.shortDescription}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">Order: {service.order}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Link
                            to={`/admin/services/${service._id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(service._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>

        {/* Pagination */}
        {!isLoading && services.length > 0 && (
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {services.length} of {total} services
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
