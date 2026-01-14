import { useState, useEffect } from "react";
import { ChevronDown, HelpCircle, FileText, Receipt, Building, Users, Phone, Mail, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollAnimation from "../components/ScrollAnimattion";
import { faqAPI } from "../services/api";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

interface GroupedFAQs {
  [category: string]: FAQ[];
}

const categoryIcons: { [key: string]: React.ElementType } = {
  'General': HelpCircle,
  'Income Tax': FileText,
  'GST': Receipt,
  'Company & Startup': Building,
  'Audit & Accounting': Users
};

const defaultCategories = ['General', 'Income Tax', 'GST', 'Company & Startup', 'Audit & Accounting'];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [groupedFaqs, setGroupedFaqs] = useState<GroupedFAQs>({});
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await faqAPI.getAll();
        if (response.data.success) {
          setGroupedFaqs(response.data.grouped || {});
          const fetchedCategories = response.data.categories || [];
          if (fetchedCategories.length > 0) {
            setCategories(fetchedCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (categoryIndex: number, faqIndex: number) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  const currentCategory = categories[activeCategory] || 'General';
  const currentFaqs = groupedFaqs[currentCategory] || [];
  const IconComponent = categoryIcons[currentCategory] || HelpCircle;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[55vh] sm:min-h-[60vh] md:min-h-[65vh] pt-28 sm:pt-32 pb-16 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
          {/* Floating Objects */}
          <motion.div
            className="absolute top-[20%] left-[8%] w-14 h-14 bg-white/10 rounded-full"
            animate={{ y: [0, -25, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[30%] right-[12%] w-10 h-10 border-2 border-white/20 rounded-lg"
            animate={{ y: [0, 20, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute bottom-[35%] left-[15%] w-6 h-6 bg-blue-300/25 rounded-full"
            animate={{ y: [0, -18, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-[28%] right-[8%] w-16 h-16 bg-white/5 rounded-xl backdrop-blur-sm"
            animate={{ y: [0, 22, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="absolute top-[45%] left-[25%] w-8 h-8 border border-white/15 rounded-full"
            animate={{ y: [0, -20, 0], x: [0, -12, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6"
          >
            Help Center
          </motion.span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            Frequently Asked <span className="text-blue-300">Questions</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            Find answers to common questions about our CA services, tax filing, GST compliance, and more
          </p>
        </motion.div>
      </section>

      {/* Category Tabs */}
      <section className="py-6 bg-white border-b sticky top-[88px] sm:top-[92px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category, index) => {
              const CategoryIcon = categoryIcons[category] || HelpCircle;
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(index)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    activeCategory === index
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <CategoryIcon size={16} />
                  <span className="hidden sm:inline">{category}</span>
                  <span className="sm:hidden">{category.split(' ')[0]}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Current Category Header */}
            <ScrollAnimation>
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {currentCategory}
                </h2>
                <p className="text-gray-600">
                  {currentFaqs.length} questions answered
                </p>
              </div>
            </ScrollAnimation>

            {/* Loading State */}
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : currentFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No FAQs Yet</h3>
                <p className="text-gray-500">Questions for this category will be added soon.</p>
              </div>
            ) : (
              /* FAQ Items */
              <div className="space-y-4">
                {currentFaqs.map((faq, faqIndex) => (
                  <ScrollAnimation key={faq._id} delay={faqIndex * 0.05}>
                    <motion.div
                      initial={false}
                      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:border-blue-200 transition-colors"
                    >
                      <button
                        onClick={() => toggleFaq(activeCategory, faqIndex)}
                        className="w-full flex justify-between items-center px-5 sm:px-6 py-4 sm:py-5 text-left font-semibold text-gray-800 hover:bg-blue-50/50 transition gap-4"
                      >
                        <span className="text-sm sm:text-base">{faq.question}</span>
                        <motion.div
                          animate={{ rotate: openIndex === `${activeCategory}-${faqIndex}` ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown className="w-5 h-5 text-blue-600" />
                        </motion.div>
                      </button>

                      <AnimatePresence initial={false}>
                        {openIndex === `${activeCategory}-${faqIndex}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-600 leading-relaxed text-sm sm:text-base border-t border-gray-100 pt-4">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </ScrollAnimation>
                ))}
              </div>
            )}

            {/* Quick Navigation */}
            {!loading && Object.keys(groupedFaqs).length > 0 && (
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {categories.map((category, index) => {
                  const NavIcon = categoryIcons[category] || HelpCircle;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ y: -3 }}
                      onClick={() => {
                        setActiveCategory(index);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className={`p-4 rounded-xl text-center transition-all ${
                        activeCategory === index
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:shadow-md"
                      }`}
                    >
                      <NavIcon className={`w-6 h-6 mx-auto mb-2 ${activeCategory === index ? "text-white" : "text-blue-600"}`} />
                      <span className="text-xs font-medium">{category.split(' ')[0]}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                Need More Help?
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Still Have Questions?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Can't find what you're looking for? Our expert Chartered Accountants are here to help you with personalized guidance.
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Phone,
                title: "Call Us",
                description: "Speak directly with our experts",
                action: "+91-9034059226",
                link: "tel:+919034059226",
                color: "bg-green-100 text-green-600"
              },
              {
                icon: Mail,
                title: "Email Us",
                description: "Get a detailed response",
                action: "contact@asguptaco.com",
                link: "mailto:contact@asguptaco.com",
                color: "bg-blue-100 text-blue-600"
              },
              {
                icon: MessageCircle,
                title: "WhatsApp",
                description: "Quick chat support",
                action: "Send Message",
                link: "https://wa.me/919034059226",
                color: "bg-emerald-100 text-emerald-600"
              }
            ].map((item, index) => (
              <ScrollAnimation key={index} delay={index * 0.1}>
                <motion.a
                  href={item.link}
                  target={item.link.startsWith('http') ? '_blank' : undefined}
                  rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="block bg-gray-50 p-6 rounded-2xl text-center hover:shadow-lg transition-all"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${item.color} rounded-xl mb-4`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <span className="text-blue-600 font-semibold text-sm">{item.action}</span>
                </motion.a>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <ScrollAnimation>
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Ready to Get Expert Assistance?
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-8">
                Schedule a free consultation with our experienced Chartered Accountants and get personalized solutions for all your tax and compliance needs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-3.5 rounded-full font-bold hover:bg-blue-50 transition cursor-pointer"
                  >
                    Book Free Consultation
                  </motion.span>
                </Link>
                <a href="tel:+919034059226">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/10 transition cursor-pointer"
                  >
                    Call Now
                  </motion.span>
                </a>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </>
  );
}
