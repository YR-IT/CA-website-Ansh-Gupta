import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, HelpCircle, Settings, X, Save } from 'lucide-react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../components/AdminLayout';

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

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  icon: string;
  order: number;
  isActive: boolean;
}

const categoryColors: { [key: string]: string } = {
  'General': 'bg-gray-100 text-gray-700',
  'Income Tax': 'bg-blue-100 text-blue-700',
  'GST': 'bg-green-100 text-green-700',
  'Company & Startup': 'bg-purple-100 text-purple-700',
  'Audit & Accounting': 'bg-amber-100 text-amber-700'
};

export default function FAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);

  useEffect(() => {
    fetchFaqs();
    fetchCategories();
  }, []);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getFaqs(1, 100);
      setFaqs(response.data.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminAPI.getCategories('faq');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      await adminAPI.deleteFaq(id);
      fetchFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Failed to delete FAQ');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCategoryLoading(true);
    try {
      await adminAPI.createCategory({ name: newCategoryName.trim(), type: 'faq' });
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
      fetchFaqs(); // Refresh FAQs as category names might have changed
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

  const filteredFaqs = filter === 'All'
    ? faqs
    : faqs.filter(faq => faq.category === filter);

  const categoryNames = ['All', ...categories.map(c => c.name)];

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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">FAQs</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage frequently asked questions</p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/admin/faqs/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition w-full sm:w-auto"
            >
              <Plus size={20} />
              Add FAQ
            </Link>
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition flex items-center gap-1"
          >
            <Settings size={14} />
            Manage
          </button>
        </motion.div>

        {/* FAQs List */}
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
          ) : filteredFaqs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center"
            >
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No FAQs found</p>
              <Link
                to="/admin/faqs/new"
                className="text-blue-600 hover:underline"
              >
                Create your first FAQ
              </Link>
            </motion.div>
          ) : (
            <div className="divide-y">
              <AnimatePresence>
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 sm:p-6 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[faq.category] || 'bg-gray-100 text-gray-700'}`}>
                            {faq.category}
                          </span>
                          {faq.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <Eye size={10} />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <EyeOff size={10} />
                              Inactive
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            Order: {faq.order}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {faq.question}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {faq.answer}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Link
                            to={`/admin/faqs/${faq._id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition block"
                          >
                            <Edit size={18} />
                          </Link>
                        </motion.div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(faq._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        {!isLoading && faqs.length > 0 && (
          <motion.div variants={itemVariants} className="text-sm text-gray-600">
            Showing {filteredFaqs.length} of {faqs.length} FAQs
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
                <h3 className="text-lg font-bold">Manage FAQ Categories</h3>
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
                  <p className="text-gray-500 text-center py-4">No categories yet</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
