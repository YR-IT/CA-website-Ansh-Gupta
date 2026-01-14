import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calculator,
  TrendingUp,
  Shield,
  Users,
  Building,
  Receipt,
  PieChart,
  Briefcase,
  DollarSign,
  CreditCard,
  BarChart,
  Globe,
  Scale,
  BookOpen,
  Award,
  ArrowRight,
  ChevronRight,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { servicesAPI } from '../services/api';
import Pagination from '../components/Pagination';
import ScrollAnimation from '../components/ScrollAnimattion';
import { useSiteInfo, getPhoneLink } from '../context/SiteContext';

// Icon mapping
const iconMap: { [key: string]: any } = {
  Calculator, FileText, TrendingUp, Shield, Users, Building, Receipt, PieChart,
  Briefcase, DollarSign, CreditCard, BarChart, Globe, Scale, BookOpen, Award
};

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  icon: string;
  subServices?: any[];
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const { siteInfo } = useSiteInfo();
  const limit = 8;

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  const fetchServices = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await servicesAPI.getAll(page, limit);
      setServices(response.data.data);
      setTotalPages(response.data.pages || 1);
      setTotal(response.data.total || response.data.data.length);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section with Breadcrumb */}
      <section className="relative min-h-[65vh] sm:min-h-[70vh] md:min-h-[75vh] pt-28 sm:pt-32 pb-16 sm:pb-20 flex items-center">
        <img
          src="/services-hero.jpeg"
          alt="Our Services"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/80 to-blue-800/70" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/80 mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={16} />
              <span className="text-white font-medium">Services</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Professional <span className="text-blue-300">Financial</span> Services
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-5 max-w-2xl">
              Comprehensive accounting, taxation, audit, and advisory services designed to help your business thrive and grow with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-3.5 rounded-full font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
              >
                Get Free Consultation <ArrowRight size={18} />
              </Link>
              <a
                href={getPhoneLink(siteInfo.phone)}
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                <Phone size={18} /> Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                Our Services
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Comprehensive CA Services
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                From taxation to audit, we offer a complete range of Chartered Accountancy services to meet all your financial needs
              </p>
            </div>
          </ScrollAnimation>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No services available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {services.map((service, index) => {
                  const Icon = iconMap[service.icon] || FileText;
                  const hasSubServices = service.subServices && service.subServices.length > 0;

                  return (
                    <ScrollAnimation key={service._id} delay={index * 0.05}>
                      <Link
                        to={`/services/${service.slug}`}
                        className="block h-full"
                      >
                        <motion.div
                          whileHover={{ y: -8, scale: 1.02 }}
                          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full border border-transparent hover:border-blue-200"
                        >
                          <div className="p-6">
                            <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:from-blue-600 group-hover:to-blue-500 transition-all duration-300">
                              <Icon className="text-blue-600 group-hover:text-white transition-colors duration-300" size={32} />
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                              {service.title}
                            </h3>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {service.shortDescription}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                {hasSubServices ? (
                                  <>{service.subServices?.length} Sub-services</>
                                ) : (
                                  <>Learn More</>
                                )}
                                <ArrowRight size={16} />
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </ScrollAnimation>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12 flex flex-col items-center gap-4"
                >
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
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 sm:py-16 md:py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full" />
        </div>
        <div className="container mx-auto px-4 relative">
          <ScrollAnimation>
            <div className="text-center text-white max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-8">
                Our team of experienced Chartered Accountants is ready to help you navigate complex financial challenges and achieve your business goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-3.5 rounded-full font-bold hover:bg-blue-50 transition-all hover:scale-105"
                >
                  Schedule Free Consultation <ArrowRight size={18} />
                </Link>
                <a
                  href={getPhoneLink(siteInfo.phone)}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/10 transition-all"
                >
                  <Phone size={18} /> Call Us Now
                </a>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </>
  );
}
