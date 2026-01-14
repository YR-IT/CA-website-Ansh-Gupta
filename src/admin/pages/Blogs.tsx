import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Settings, X, Save, BookOpen, Star } from 'lucide-react';
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

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchBlogs(currentPage);
    fetchCategories();
  }, [currentPage]);

  const fetchBlogs = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getBlogs(page, limit);
      setBlogs(response.data.data);
      setTotalPages(response.data.pages);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminAPI.getCategories('blog');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await adminAPI.deleteBlog(id);
      // Refresh the current page after deletion
      fetchBlogs(currentPage);
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCategoryLoading(true);
    try {
      await adminAPI.createCategory({ name: newCategoryName.trim(), type: 'blog' });
      setNewCategoryName('');
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add category');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) return;
    setCategoryLoading(true);
    try {
      await adminAPI.updateCategory(editingCategory._id, { name: newCategoryName.trim() });
      setEditingCategory(null);
      setNewCategoryName('');
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update category');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await adminAPI.deleteCategory(id);
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete category');
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your blog articles</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2 rounded-lg flex items-center justify-center gap-2 bg-gray-800 text-white hover:bg-gray-700 transition"
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Categories</span>
            </button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/admin/blogs/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
              >
                <Plus size={20} />
                Create Post
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Blogs List */}
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
          ) : blogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center"
            >
              <p className="text-gray-500 mb-4">No blog posts found</p>
              <Link
                to="/admin/blogs/new"
                className="text-blue-600 hover:underline"
              >
                Create your first blog post
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
                        Author
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                        Views
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <AnimatePresence>
                      {blogs.map((blog, index) => (
                        <motion.tr
                          key={blog._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.03)' }}
                          className="transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 max-w-xs truncate">
                              {blog.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              /{blog.slug}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {blog.author}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {blog.isPublished ? (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                                >
                                  <Eye size={12} />
                                  Published
                                </motion.span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                  <EyeOff size={12} />
                                  Draft
                                </span>
                              )}
                              {blog.isFeatured && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"
                                >
                                  <Star size={12} />
                                  Featured
                                </motion.span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              {blog.views}
                            </motion.span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Link
                                  to={`/admin/blogs/${blog._id}/edit`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition block"
                                >
                                  <Edit size={18} />
                                </Link>
                              </motion.div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(blog._id)}
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
                  {blogs.map((blog, index) => (
                    <motion.div
                      key={blog._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium text-gray-900 text-sm truncate max-w-[200px]">
                              {blog.title}
                            </h3>
                            {blog.isPublished ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <Eye size={10} />
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                <EyeOff size={10} />
                                Draft
                              </span>
                            )}
                            {blog.isFeatured && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                <Star size={10} />
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">/{blog.slug}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>By {blog.author}</span>
                            <span className="flex items-center gap-1">
                              <Eye size={12} />
                              {blog.views} views
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Link
                            to={`/admin/blogs/${blog._id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog._id)}
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
        {!isLoading && blogs.length > 0 && (
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {blogs.length} of {total} blogs
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Category Management Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Manage Blog Categories</h3>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Add New Category */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder={editingCategory ? "Edit category name..." : "New category name..."}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (editingCategory ? handleUpdateCategory() : handleAddCategory())}
                />
                {editingCategory ? (
                  <>
                    <button
                      onClick={handleUpdateCategory}
                      disabled={categoryLoading}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={() => { setEditingCategory(null); setNewCategoryName(''); }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAddCategory}
                    disabled={categoryLoading}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>

              {/* Category List */}
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">{cat.name}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditingCategory(cat); setNewCategoryName(cat.name); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="text-center py-4">
                    <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No categories yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
