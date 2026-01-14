import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import RichTextEditor from '../components/RichTextEditor';

interface Category {
  _id: string;
  name: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Others',
    isPublished: true,
    isFeatured: false
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEdit && id) {
      fetchBlog(id);
    }
  }, [id, isEdit]);

  const fetchCategories = async () => {
    try {
      const response = await adminAPI.getCategories('blog');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBlog = async (blogId: string) => {
    try {
      const response = await adminAPI.getBlog(blogId);
      const blog = response.data.data;
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        category: blog.category || 'Others',
        isPublished: blog.isPublished,
        isFeatured: blog.isFeatured || false
      });
      if (blog.image?.data) {
        setImagePreview(`data:${blog.image.contentType};base64,${blog.image.data}`);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog');
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('excerpt', formData.excerpt);
      data.append('content', formData.content);
      data.append('author', formData.author);
      data.append('category', formData.category);
      data.append('isPublished', String(formData.isPublished));
      data.append('isFeatured', String(formData.isFeatured));
      if (image) {
        data.append('image', image);
      }

      if (isEdit && id) {
        await adminAPI.updateBlog(id, data);
      } else {
        await adminAPI.createBlog(data);
      }

      navigate('/admin/blogs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save blog');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
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

  return (
    <AdminLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 sm:gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/admin/blogs')}
            className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 truncate">
              {isEdit ? 'Update blog details' : 'Write a new blog article'}
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-100"
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow"
                placeholder="Enter blog title"
              />
            </motion.div>

            {/* Author and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Author */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow"
                  placeholder="e.g., CA. Anshul Gupta"
                />
              </motion.div>

              {/* Category */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.17 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </motion.div>
            </div>

            {/* Excerpt */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt * (max 300 characters)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
                maxLength={300}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow"
                placeholder="Brief summary shown in blog listings"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.excerpt.length}/300 characters
              </p>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Content *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Write your blog content here..."
              />
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <motion.div
                whileHover={{ borderColor: 'rgb(59, 130, 246)' }}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {imagePreview ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative"
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.label
                      key="upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload size={40} className="text-gray-400 mb-2" />
                      <span className="text-gray-600">Click to upload image</span>
                      <span className="text-sm text-gray-400">PNG, JPG up to 10MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </motion.label>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Published & Featured Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                  Publish immediately (visible on website)
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-5 h-5 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                  Mark as Featured (highlighted on website)
                </label>
              </div>
            </motion.div>
          </motion.div>

          {/* Submit Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate('/admin/blogs')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-center"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Saving...
                </span>
              ) : isEdit ? 'Update Blog' : 'Publish Blog'}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </AdminLayout>
  );
}
