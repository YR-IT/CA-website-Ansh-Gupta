import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, X, Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import RichTextEditor from '../components/RichTextEditor';

const iconOptions = [
  'Calculator', 'FileText', 'TrendingUp', 'Shield', 'Users', 'Building', 'Receipt', 'PieChart',
  'Briefcase', 'DollarSign', 'CreditCard', 'BarChart', 'Globe', 'Scale', 'BookOpen', 'Award'
];

interface ImageData {
  data: string;
  contentType: string;
}

interface SubService {
  _id?: string;
  title: string;
  shortDescription: string;
  content: string;
  isActive: boolean;
  order: number;
  images?: ImageData[];
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

export default function ServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    content: '',
    icon: 'FileText',
    isActive: true,
    order: 0
  });
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [expandedSubService, setExpandedSubService] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ImageData[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      fetchService(id);
    }
  }, [id, isEdit]);

  const fetchService = async (serviceId: string) => {
    try {
      const response = await adminAPI.getService(serviceId);
      const service = response.data.data;
      setFormData({
        title: service.title,
        shortDescription: service.shortDescription,
        content: service.content || '',
        icon: service.icon,
        isActive: service.isActive,
        order: service.order
      });
      if (service.subServices && service.subServices.length > 0) {
        setSubServices(service.subServices);
      }
      // Handle multiple images
      if (service.images && service.images.length > 0) {
        setExistingImages(service.images);
        setImagePreviews(service.images.map((img: ImageData) =>
          `data:${img.contentType};base64,${img.data}`
        ));
      } else if (service.image?.data) {
        // Fallback to legacy single image
        const legacyImage = { data: service.image.data, contentType: service.image.contentType };
        setExistingImages([legacyImage]);
        setImagePreviews([`data:${service.image.contentType};base64,${service.image.data}`]);
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      setError('Failed to load service');
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + images.length + files.length;

    if (totalImages > 3) {
      setError('Maximum 3 images allowed');
      return;
    }

    // Add new files
    setImages(prev => [...prev, ...files]);

    // Create previews for new files
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const isExisting = index < existingImages.length;

    if (isExisting) {
      // Remove from existing images
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove from new images
      const newIndex = index - existingImages.length;
      setImages(prev => prev.filter((_, i) => i !== newIndex));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle sub-service image upload
  const handleSubServiceImageChange = (subIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImages = subServices[subIndex].images || [];

    if (currentImages.length + files.length > 3) {
      setError('Maximum 3 images allowed per sub-service');
      return;
    }

    // Convert files to base64
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        const newImage: ImageData = {
          data: base64,
          contentType: file.type
        };
        updateSubService(subIndex, 'images', [...(subServices[subIndex].images || []), newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeSubServiceImage = (subIndex: number, imgIndex: number) => {
    const updated = subServices[subIndex].images?.filter((_, i) => i !== imgIndex) || [];
    updateSubService(subIndex, 'images', updated);
  };

  const addSubService = () => {
    const newSubService: SubService = {
      title: '',
      shortDescription: '',
      content: '',
      isActive: true,
      order: subServices.length,
      images: []
    };
    setSubServices([...subServices, newSubService]);
    setExpandedSubService(subServices.length);
  };

  const updateSubService = (index: number, field: keyof SubService, value: any) => {
    const updated = [...subServices];
    updated[index] = { ...updated[index], [field]: value };
    setSubServices(updated);
  };

  const removeSubService = (index: number) => {
    const updated = subServices.filter((_, i) => i !== index);
    // Update order values
    updated.forEach((sub, i) => {
      sub.order = i;
    });
    setSubServices(updated);
    if (expandedSubService === index) {
      setExpandedSubService(null);
    } else if (expandedSubService !== null && expandedSubService > index) {
      setExpandedSubService(expandedSubService - 1);
    }
  };

  const moveSubService = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === subServices.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...subServices];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    // Update order values
    updated.forEach((sub, i) => {
      sub.order = i;
    });

    setSubServices(updated);
    setExpandedSubService(newIndex);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('shortDescription', formData.shortDescription);
      data.append('content', formData.content);
      data.append('icon', formData.icon);
      data.append('isActive', String(formData.isActive));
      data.append('order', String(formData.order));

      // Prepare sub-services without images (images sent separately)
      const subServicesWithoutImages = subServices.map(({ images, ...rest }) => rest);
      data.append('subServices', JSON.stringify(subServicesWithoutImages));

      // Send sub-service images as JSON
      const subServiceImagesData = subServices.map(sub => sub.images || []);
      data.append('subServiceImages', JSON.stringify(subServiceImagesData));

      // Append existing images that should be kept
      data.append('existingImages', JSON.stringify(existingImages));

      // Append new image files
      images.forEach(image => {
        data.append('images', image);
      });

      if (isEdit && id) {
        await adminAPI.updateService(id, data);
      } else {
        await adminAPI.createService(data);
      }

      navigate('/admin/services');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save service');
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
            onClick={() => navigate('/admin/services')}
            className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {isEdit ? 'Edit Service' : 'Create New Service'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 truncate">
              {isEdit ? 'Update service details' : 'Add a new service to your website'}
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

          {/* Main Service Details */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-100"
          >
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 border-b pb-3">Main Service Details</h2>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow"
                placeholder="e.g., International Taxation"
              />
            </motion.div>

            {/* Short Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description * (max 300 characters)
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                required
                maxLength={300}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow"
                placeholder="Brief description shown in service cards"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.shortDescription.length}/300 characters
              </p>
            </motion.div>

            {/* Content (optional for services with sub-services) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Content {subServices.length === 0 && '*'}
                {subServices.length > 0 && <span className="text-gray-400 font-normal">(Optional when sub-services exist)</span>}
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Write detailed service information..."
              />
            </motion.div>

            {/* Icon Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Multiple Images Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Images (Max 3)
              </label>
              <div className="space-y-4">
                {/* Image Previews Grid */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={14} />
                        </motion.button>
                        <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                          {index + 1}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {imagePreviews.length < 3 && (
                  <motion.div
                    whileHover={{ borderColor: 'rgb(59, 130, 246)' }}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors"
                  >
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload size={32} className="text-gray-400 mb-2" />
                      <span className="text-gray-600">Click to upload images</span>
                      <span className="text-sm text-gray-400">PNG, JPG up to 10MB each ({3 - imagePreviews.length} remaining)</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </motion.label>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Order and Status Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Order */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full sm:w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow"
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Lower numbers appear first
                </p>
              </motion.div>

              {/* Active Status */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 sm:pt-8"
              >
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (visible on website)
                </label>
              </motion.div>
            </div>
          </motion.div>

          {/* Sub-Services Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Sub-Services</h2>
                <p className="text-xs sm:text-sm text-gray-500">Add specific services under this main category</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={addSubService}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm w-full sm:w-auto"
              >
                <Plus size={18} />
                Add Sub-Service
              </motion.button>
            </div>

            {subServices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No sub-services added yet.</p>
                <p className="text-sm">Click "Add Sub-Service" to create nested services.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {subServices.map((subService, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Sub-Service Header */}
                      <div
                        className={`flex items-center gap-3 p-4 cursor-pointer transition ${
                          expandedSubService === index ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => setExpandedSubService(expandedSubService === index ? null : index)}
                      >
                        <GripVertical size={18} className="text-gray-400" />

                        <div className="flex-1">
                          <span className="font-medium text-gray-900">
                            {subService.title || `Sub-Service ${index + 1}`}
                          </span>
                          {!subService.isActive && (
                            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                              Inactive
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSubService(index, 'up');
                            }}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronUp size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSubService(index, 'down');
                            }}
                            disabled={index === subServices.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronDown size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSubService(index);
                            }}
                            className="p-1 text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                          <motion.div
                            animate={{ rotate: expandedSubService === index ? 180 : 0 }}
                            className="text-gray-400"
                          >
                            <ChevronDown size={20} />
                          </motion.div>
                        </div>
                      </div>

                      {/* Sub-Service Form */}
                      <AnimatePresence>
                        {expandedSubService === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200"
                          >
                            <div className="p-4 space-y-4 bg-white">
                              {/* Title */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Sub-Service Title *
                                </label>
                                <input
                                  type="text"
                                  value={subService.title}
                                  onChange={(e) => updateSubService(index, 'title', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                                  placeholder="e.g., Non-Resident Taxation"
                                />
                              </div>

                              {/* Short Description */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Short Description
                                </label>
                                <textarea
                                  value={subService.shortDescription}
                                  onChange={(e) => updateSubService(index, 'shortDescription', e.target.value)}
                                  rows={2}
                                  maxLength={300}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                                  placeholder="Brief description for sub-service"
                                />
                              </div>

                              {/* Content */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Full Content *
                                </label>
                                <RichTextEditor
                                  value={subService.content}
                                  onChange={(value) => updateSubService(index, 'content', value)}
                                  placeholder="Detailed description of this sub-service..."
                                />
                              </div>

                              {/* Sub-service Images */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Images (Max 3)
                                </label>
                                <div className="space-y-3">
                                  {/* Image Previews */}
                                  {subService.images && subService.images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2">
                                      {subService.images.map((img, imgIndex) => (
                                        <div key={imgIndex} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                          <img
                                            src={`data:${img.contentType};base64,${img.data}`}
                                            alt={`Sub-service ${imgIndex + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => removeSubServiceImage(index, imgIndex)}
                                            className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                                          >
                                            <X size={12} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {/* Upload Button */}
                                  {(!subService.images || subService.images.length < 3) && (
                                    <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                                      <Upload size={18} className="text-gray-400" />
                                      <span className="text-sm text-gray-500">
                                        Add images ({3 - (subService.images?.length || 0)} remaining)
                                      </span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleSubServiceImageChange(index, e)}
                                        className="hidden"
                                      />
                                    </label>
                                  )}
                                </div>
                              </div>

                              {/* Active Status */}
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`subActive-${index}`}
                                  checked={subService.isActive}
                                  onChange={(e) => updateSubService(index, 'isActive', e.target.checked)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                                />
                                <label htmlFor={`subActive-${index}`} className="text-sm text-gray-700">
                                  Active
                                </label>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
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
              onClick={() => navigate('/admin/services')}
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
              ) : isEdit ? 'Update Service' : 'Create Service'}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </AdminLayout>
  );
}
