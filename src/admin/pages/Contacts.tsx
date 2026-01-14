import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Mail, Phone, Calendar, Eye, CheckCircle, MessageSquare, ArrowLeft } from 'lucide-react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import Pagination from '../../components/Pagination';

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

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchContacts(currentPage);
  }, [currentPage]);

  const fetchContacts = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getContacts(page, limit);
      setContacts(response.data.data);
      setTotalPages(response.data.pages);
      setTotal(response.data.total);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await adminAPI.markContactRead(id);
      setContacts(
        contacts.map((c) =>
          c._id === id ? { ...c, isRead: true } : c
        )
      );
      if (selectedContact?._id === id) {
        setSelectedContact({ ...selectedContact, isRead: true });
      }
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await adminAPI.deleteContact(id);
      if (selectedContact?._id === id) {
        setSelectedContact(null);
      }
      fetchContacts(currentPage);
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete message');
    }
  };

  const viewContact = (contact: Contact) => {
    setSelectedContact(contact);
    if (!contact.isRead) {
      handleMarkRead(contact._id);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedContact(null);
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
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Contact Submissions</h1>
            <p className="text-sm sm:text-base text-gray-600">
              {unreadCount > 0 ? (
                <motion.span
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="inline-flex items-center gap-1"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                  {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
                </motion.span>
              ) : (
                'All messages read'
              )}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Contacts List */}
          <motion.div
            variants={itemVariants}
            className={`lg:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 ${
              selectedContact ? 'hidden lg:block' : 'block'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="rounded-full h-12 w-12 border-b-2 border-blue-600"
                />
              </div>
            ) : contacts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center"
              >
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No contact submissions yet</p>
              </motion.div>
            ) : (
              <div className="divide-y max-h-[600px] overflow-y-auto">
                <AnimatePresence>
                  {contacts.map((contact, index) => (
                    <motion.div
                      key={contact._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => viewContact(contact)}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                      className={`p-4 cursor-pointer transition ${
                        selectedContact?._id === contact._id ? 'bg-blue-50' : ''
                      } ${!contact.isRead ? 'border-l-4 border-blue-600' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium truncate ${!contact.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                              {contact.name}
                            </p>
                            {!contact.isRead && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full"
                              >
                                New
                              </motion.span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {contact.subject}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Contact Detail */}
          <motion.div
            variants={itemVariants}
            className={`lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 ${
              selectedContact ? 'block' : 'hidden lg:block'
            }`}
          >
            <AnimatePresence mode="wait">
              {selectedContact ? (
                <motion.div
                  key={selectedContact._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 sm:p-6"
                >
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm"
                  >
                    <ArrowLeft size={18} />
                    Back to messages
                  </button>

                  {/* Contact Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="min-w-0 flex-1"
                    >
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                        {selectedContact.name}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-500 truncate">{selectedContact.subject}</p>
                    </motion.div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {selectedContact.isRead && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 text-green-600 text-xs sm:text-sm"
                        >
                          <CheckCircle size={16} />
                          Read
                        </motion.span>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(selectedContact._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="text-blue-600 flex-shrink-0" size={18} />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Email</p>
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="text-blue-600 hover:underline text-sm truncate block"
                        >
                          {selectedContact.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-blue-600 flex-shrink-0" size={18} />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Phone</p>
                        {selectedContact.phone ? (
                          <a
                            href={`tel:${selectedContact.phone}`}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {selectedContact.phone}
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">Not provided</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <Calendar className="text-blue-600 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Submitted On</p>
                        <p className="text-gray-700 text-sm">
                          {new Date(selectedContact.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Message
                    </h3>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base">
                        {selectedContact.message}
                      </p>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6"
                  >
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                      className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Mail size={18} />
                      Reply via Email
                    </motion.a>
                    {selectedContact.phone && (
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={`tel:${selectedContact.phone}`}
                        className="border border-gray-300 text-gray-700 px-4 sm:px-6 py-2.5 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <Phone size={18} />
                        Call
                      </motion.a>
                    )}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hidden lg:flex items-center justify-center h-full min-h-[400px] text-gray-500"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Eye size={48} className="mx-auto mb-4 text-gray-300" />
                    </motion.div>
                    <p>Select a message to view details</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Pagination */}
        {!isLoading && contacts.length > 0 && (
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {contacts.length} of {total} messages
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
