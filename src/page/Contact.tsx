import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, CheckCircle, Send, ChevronRight } from "lucide-react";
import ScrollAnimation from "../components/ScrollAnimattion";
import { motion } from "framer-motion";
import { contactAPI, aboutUsAPI } from "../services/api";
import { Link } from "react-router-dom";
import { useSiteInfo, getPhoneLink, getEmailLink } from "../context/SiteContext";

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: '',
    phone: '',
    email: '',
    workingHours: ''
  });
  const { siteInfo } = useSiteInfo();

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await aboutUsAPI.get();
        if (response.data.success && response.data.data) {
          const { address, phone, email, workingHours } = response.data.data;
          setContactInfo({ address, phone, email, workingHours });
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };
    fetchContactInfo();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const submitData = {
        ...formData,
        phone: formData.phone ? `+91${formData.phone}` : ''
      };
      const response = await contactAPI.submit(submitData);
      setSubmitStatus({
        success: true,
        message: response.data.message
      });
      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error: any) {
      setSubmitStatus({
        success: false,
        message: error.response?.data?.message || "Failed to submit. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[55vh] sm:min-h-[60vh] pt-32 sm:pt-36 pb-16 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
          {/* Floating Objects */}
          <motion.div
            className="absolute top-[15%] left-[10%] w-16 h-16 bg-white/10 rounded-lg backdrop-blur-sm"
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[25%] right-[15%] w-12 h-12 bg-blue-400/20 rounded-full"
            animate={{ y: [0, 25, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute bottom-[30%] left-[20%] w-8 h-8 bg-white/15 rounded-full"
            animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-[25%] right-[10%] w-20 h-20 border-2 border-white/20 rounded-xl"
            animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="absolute top-[40%] right-[25%] w-6 h-6 bg-blue-300/30 rounded-full"
            animate={{ y: [0, -30, 0], x: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-sm text-white/80 mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={16} />
              <span className="text-white font-medium">Contact Us</span>
            </nav>

            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-6"
            >
              Get In Touch
            </motion.span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Let's Start a <span className="text-blue-300">Conversation</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Have questions about our services? We'd love to hear from you. Reach out and let's discuss how we can help your business grow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 max-w-7xl mx-auto">

            {/* Contact Form - Takes 3 columns */}
            <div className="lg:col-span-3">
              <ScrollAnimation>
                <motion.div
                  className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100"
                  whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      Send Us a Message
                    </h2>
                    <p className="text-gray-600">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  {submitStatus?.success ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 text-center"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-600 mb-6">{submitStatus.message}</p>
                      <button
                        onClick={() => setSubmitStatus(null)}
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {submitStatus && !submitStatus.success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                        >
                          {submitStatus.message}
                        </motion.div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all"
                            placeholder="Your full name"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Phone Number
                          </label>
                          <div className="flex">
                            <span className="inline-flex items-center px-4 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
                              +91
                            </span>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setFormData({ ...formData, phone: value });
                              }}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all"
                              placeholder="XXXXX XXXXX"
                              maxLength={10}
                            />
                          </div>
                          {formData.phone && formData.phone.length < 10 && formData.phone.length > 0 && (
                            <p className="text-red-500 text-sm mt-1">Phone number must be 10 digits</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all"
                            placeholder="How can we help?"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all resize-none"
                          placeholder="Tell us more about your requirements..."
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Sending...
                          </span>
                        ) : (
                          <>
                            <Send size={18} />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </form>
                  )}
                </motion.div>
              </ScrollAnimation>
            </div>

            {/* Contact Info - Takes 2 columns */}
            <div className="lg:col-span-2">
              <ScrollAnimation delay={0.1}>
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 sm:p-8 text-white mb-6 shadow-xl">
                  <h3 className="text-xl sm:text-2xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    {contactInfo.address && (
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-start gap-4"
                      >
                        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin size={22} />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Our Office</h4>
                          <p className="text-white/80 text-sm">{contactInfo.address}</p>
                        </div>
                      </motion.div>
                    )}

                    {contactInfo.phone && (
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-start gap-4"
                      >
                        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Phone size={22} />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Phone</h4>
                          <a href={`tel:${contactInfo.phone}`} className="text-white/80 text-sm hover:text-white transition">
                            {contactInfo.phone}
                          </a>
                        </div>
                      </motion.div>
                    )}

                    {contactInfo.email && (
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-start gap-4"
                      >
                        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Mail size={22} />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Email</h4>
                          <a href={`mailto:${contactInfo.email}`} className="text-white/80 text-sm hover:text-white transition">
                            {contactInfo.email}
                          </a>
                        </div>
                      </motion.div>
                    )}

                    {contactInfo.workingHours && (
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-start gap-4"
                      >
                        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Clock size={22} />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Business Hours</h4>
                          <p className="text-white/80 text-sm">{contactInfo.workingHours}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </ScrollAnimation>

              {/* Quick Contact Card */}
              <ScrollAnimation delay={0.2}>
                <motion.div
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Need Quick Help?</h3>
                  <p className="text-gray-600 mb-6">
                    Call us directly for immediate assistance with your queries.
                  </p>
                  <a
                    href={getPhoneLink(contactInfo.phone || siteInfo.phone)}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all w-full justify-center shadow-lg shadow-green-500/30"
                  >
                    <Phone size={20} />
                    Call Now
                  </a>
                </motion.div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
