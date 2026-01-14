import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../components/AdminLayout';

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

interface CoreValue {
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface WhyChoosePoint {
  title: string;
  description: string;
  icon: string;
}

interface ServiceArea {
  city: string;
  isActive: boolean;
}

interface AboutUsData {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyContent: string;
  missionTitle: string;
  missionContent: string;
  visionTitle: string;
  visionContent: string;
  coreValues: CoreValue[];
  teamTitle: string;
  teamSubtitle: string;
  whyChooseUsTitle: string;
  whyChooseUsPoints: WhyChoosePoint[];
  serviceAreas: ServiceArea[];
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

const iconOptions = ['Shield', 'Target', 'Heart', 'TrendingUp', 'Award', 'Users', 'Clock', 'Star', 'CheckCircle', 'Lightbulb'];

export default function AboutUsPage() {
  const [formData, setFormData] = useState<AboutUsData>({
    heroTitle: '',
    heroSubtitle: '',
    storyTitle: '',
    storyContent: '',
    missionTitle: '',
    missionContent: '',
    visionTitle: '',
    visionContent: '',
    coreValues: [],
    teamTitle: '',
    teamSubtitle: '',
    whyChooseUsTitle: '',
    whyChooseUsPoints: [],
    serviceAreas: [],
    address: '',
    phone: '',
    email: '',
    workingHours: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const response = await adminAPI.getAboutUs();
      if (response.data.success && response.data.data) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching About Us:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = new FormData();

      // Add all text fields
      data.append('heroTitle', formData.heroTitle);
      data.append('heroSubtitle', formData.heroSubtitle);
      data.append('storyTitle', formData.storyTitle);
      data.append('storyContent', formData.storyContent);
      data.append('missionTitle', formData.missionTitle);
      data.append('missionContent', formData.missionContent);
      data.append('visionTitle', formData.visionTitle);
      data.append('visionContent', formData.visionContent);
      data.append('teamTitle', formData.teamTitle);
      data.append('teamSubtitle', formData.teamSubtitle);
      data.append('whyChooseUsTitle', formData.whyChooseUsTitle);
      data.append('address', formData.address);
      data.append('phone', formData.phone);
      data.append('email', formData.email);
      data.append('workingHours', formData.workingHours);

      // Add arrays as JSON strings
      data.append('coreValues', JSON.stringify(formData.coreValues));
      data.append('whyChooseUsPoints', JSON.stringify(formData.whyChooseUsPoints));
      data.append('serviceAreas', JSON.stringify(formData.serviceAreas));

      await adminAPI.updateAboutUs(data);
      alert('About Us page updated successfully!');
    } catch (error) {
      console.error('Error saving About Us:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const addCoreValue = () => {
    setFormData({
      ...formData,
      coreValues: [...formData.coreValues, { title: '', description: '', icon: 'Shield', order: formData.coreValues.length }]
    });
  };

  const removeCoreValue = (index: number) => {
    setFormData({
      ...formData,
      coreValues: formData.coreValues.filter((_, i) => i !== index)
    });
  };

  const updateCoreValue = (index: number, field: keyof CoreValue, value: string | number) => {
    const updated = [...formData.coreValues];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, coreValues: updated });
  };

  const addWhyChoosePoint = () => {
    setFormData({
      ...formData,
      whyChooseUsPoints: [...formData.whyChooseUsPoints, { title: '', description: '', icon: 'Award' }]
    });
  };

  const removeWhyChoosePoint = (index: number) => {
    setFormData({
      ...formData,
      whyChooseUsPoints: formData.whyChooseUsPoints.filter((_, i) => i !== index)
    });
  };

  const updateWhyChoosePoint = (index: number, field: keyof WhyChoosePoint, value: string) => {
    const updated = [...formData.whyChooseUsPoints];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, whyChooseUsPoints: updated });
  };

  const addServiceArea = () => {
    setFormData({
      ...formData,
      serviceAreas: [...formData.serviceAreas, { city: '', isActive: true }]
    });
  };

  const removeServiceArea = (index: number) => {
    setFormData({
      ...formData,
      serviceAreas: formData.serviceAreas.filter((_, i) => i !== index)
    });
  };

  const updateServiceArea = (index: number, field: keyof ServiceArea, value: string | boolean) => {
    const updated = [...formData.serviceAreas];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, serviceAreas: updated });
  };

  const tabs = [
    { id: 'hero', label: 'Hero & Story' },
    { id: 'mission', label: 'Mission & Vision' },
    { id: 'values', label: 'Core Values' },
    { id: 'why', label: 'Why Choose Us' },
    { id: 'areas', label: 'Service Areas' },
    { id: 'contact', label: 'Contact Info' }
  ];

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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">About Us Page</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage the About Us page content</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition w-full sm:w-auto disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-2 border-b pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Form Content */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          {/* Hero & Story Tab */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="About A S GUPTA AND CO"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                  <input
                    type="text"
                    value={formData.heroSubtitle}
                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Trusted Chartered Accountants"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Our Story</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Content</label>
                  <textarea
                    value={formData.storyContent}
                    onChange={(e) => setFormData({ ...formData, storyContent: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="A S GUPTA AND CO is a professionally managed..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mission & Vision Tab */}
          {activeTab === 'mission' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Mission</h2>
                <textarea
                  value={formData.missionContent}
                  onChange={(e) => setFormData({ ...formData, missionContent: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="To provide exceptional financial services..."
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Vision</h2>
                <textarea
                  value={formData.visionContent}
                  onChange={(e) => setFormData({ ...formData, visionContent: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="To be recognized as the leading..."
                />
              </div>
            </div>
          )}

          {/* Core Values Tab */}
          {activeTab === 'values' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Core Values</h2>
                <button
                  type="button"
                  onClick={addCoreValue}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                >
                  <Plus size={18} /> Add Value
                </button>
              </div>
              {formData.coreValues.map((value, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Value #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeCoreValue(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={value.title}
                      onChange={(e) => updateCoreValue(index, 'title', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="Title"
                    />
                    <select
                      value={value.icon}
                      onChange={(e) => updateCoreValue(index, 'icon', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={value.order}
                      onChange={(e) => updateCoreValue(index, 'order', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="Order"
                    />
                  </div>
                  <textarea
                    value={value.description}
                    onChange={(e) => updateCoreValue(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Description"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Why Choose Us Tab */}
          {activeTab === 'why' && (
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={formData.whyChooseUsTitle}
                  onChange={(e) => setFormData({ ...formData, whyChooseUsTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  placeholder="Why Choose A S GUPTA AND CO"
                />
              </div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Points</h2>
                <button
                  type="button"
                  onClick={addWhyChoosePoint}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                >
                  <Plus size={18} /> Add Point
                </button>
              </div>
              {formData.whyChooseUsPoints.map((point, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Point #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeWhyChoosePoint(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={point.title}
                      onChange={(e) => updateWhyChoosePoint(index, 'title', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="Title"
                    />
                    <select
                      value={point.icon}
                      onChange={(e) => updateWhyChoosePoint(index, 'icon', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={point.description}
                    onChange={(e) => updateWhyChoosePoint(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Description"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Service Areas Tab */}
          {activeTab === 'areas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Service Areas</h2>
                <button
                  type="button"
                  onClick={addServiceArea}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                >
                  <Plus size={18} /> Add Area
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.serviceAreas.map((area, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin size={18} className="text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-600">City #{index + 1}</span>
                    </div>
                    <input
                      type="text"
                      value={area.city}
                      onChange={(e) => updateServiceArea(index, 'city', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 mb-3"
                      placeholder="City name"
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={area.isActive}
                          onChange={(e) => updateServiceArea(index, 'isActive', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Active</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeServiceArea(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {formData.serviceAreas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No service areas added yet. Click "Add Area" to add one.
                </div>
              )}
            </div>
          )}

          {/* Contact Info Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-1" /> Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="3A Savitry Enclave, VIP Road, Zirakpur, Punjab"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-1" /> Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="+91 90340 59226"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-1" /> Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="contact@asguptaco.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock size={16} className="inline mr-1" /> Working Hours
                  </label>
                  <input
                    type="text"
                    value={formData.workingHours}
                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Mon - Sat: 10:00 AM - 7:00 PM"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
