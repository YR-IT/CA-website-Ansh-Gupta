import { useState, useEffect } from "react";
import HeroSlider from "../components/HeroSlider";
import ScrollAnimation from "../components/ScrollAnimattion";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Target, Eye, Shield, CheckCircle, Clock, Users,
  Globe, Receipt, Building, ShieldCheck, Calculator, TrendingUp, FileText, Briefcase
} from "lucide-react";
import { servicesAPI } from "../services/api";
import { useSiteInfo, getPhoneLink } from "../context/SiteContext";

// Icon mapping for services
const iconMap: { [key: string]: React.ElementType } = {
  Globe: Globe,
  Receipt: Receipt,
  Building: Building,
  Shield: ShieldCheck,
  Calculator: Calculator,
  TrendingUp: TrendingUp,
  FileText: FileText,
  Briefcase: Briefcase
};

// Fallback emoji icons if lucide icon not found
const emojiMap: { [key: string]: string } = {
  Globe: "🌍",
  Receipt: "📋",
  Building: "🏢",
  Shield: "🔍",
  Calculator: "📊",
  TrendingUp: "💰",
  FileText: "📝",
  Briefcase: "💼"
};

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  icon: string;
  order: number;
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { siteInfo } = useSiteInfo();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getAll(1, 8);
        // API returns { success, count, total, page, pages, data: [...services] }
        const servicesData = response.data.data || [];
        // Sort by order and take first 8
        const sortedServices = servicesData
          .sort((a: Service, b: Service) => a.order - b.order)
          .slice(0, 8);
        setServices(sortedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <HeroSlider />

      {/* ABOUT SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollAnimation>
              <div>
                <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                  About Us
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Your Trusted <span className="text-blue-600">Chartered Accountants</span>
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4 text-base sm:text-lg">
                  A S Gupta & Co is a professionally managed Chartered Accountancy firm providing comprehensive accounting, taxation, audit, and advisory services to businesses and individuals across India.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6 text-base sm:text-lg">
                  Our firm is built on integrity, expertise, and a commitment to helping clients grow with confidence and full regulatory compliance.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                  >
                    Learn More <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
                  >
                    Get Consultation
                  </Link>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: CheckCircle, title: "Expert Team", desc: "Qualified CAs with industry expertise" },
                  { icon: Shield, title: "100% Compliant", desc: "Full statutory compliance guaranteed" },
                  { icon: Clock, title: "Timely Delivery", desc: "On-time service every time" },
                  { icon: Users, title: "Client Focused", desc: "Personalized attention to needs" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 p-5 rounded-xl hover:shadow-lg transition-all"
                  >
                    <item.icon className="w-10 h-10 text-blue-600 mb-3" />
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                Our Services
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Comprehensive CA Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Professional accounting, taxation, and advisory services tailored to your business needs
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : (
              services.map((service, index) => {
                const IconComponent = iconMap[service.icon];
                const emoji = emojiMap[service.icon] || "📌";

                return (
                  <ScrollAnimation key={service._id || index} delay={index * 0.05}>
                    <Link to={`/services/${service.slug}`}>
                      <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 h-full group border border-transparent hover:border-blue-200"
                      >
                        {IconComponent ? (
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <IconComponent className="w-6 h-6 text-blue-600" />
                          </div>
                        ) : (
                          <span className="text-4xl mb-4 block">{emoji}</span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{service.shortDescription}</p>
                        <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold group-hover:gap-2 transition-all">
                          Learn More <ArrowRight size={14} />
                        </span>
                      </motion.div>
                    </Link>
                  </ScrollAnimation>
                );
              })
            )}
          </div>

          <ScrollAnimation delay={0.3}>
            <div className="text-center mt-10">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
              >
                View All Services <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* MISSION & VISION SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollAnimation>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 sm:p-10 rounded-2xl h-full"
              >
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h3>
                <p className="text-white/90 leading-relaxed text-lg">
                  To provide exceptional financial services with integrity, expertise, and dedication. We aim to be trusted advisors helping businesses navigate complex financial landscapes while ensuring complete compliance and sustainable growth.
                </p>
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.2}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-8 sm:p-10 rounded-2xl h-full"
              >
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Our Vision</h3>
                <p className="text-white/90 leading-relaxed text-lg">
                  To be recognized as a leading Chartered Accountancy firm known for excellence, innovation, and client satisfaction. We strive to build lasting relationships through continuous learning, professional ethics, and value-driven services.
                </p>
              </motion.div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                The A S Gupta & Co Advantage
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We deliver excellence through expertise, integrity, and personalized attention
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🎯", title: "Expert Guidance", desc: "Our team of qualified CAs brings years of industry experience to provide reliable, accurate advice for all your financial needs." },
              { icon: "⚡", title: "Quick Turnaround", desc: "We value your time. Our streamlined processes ensure efficient service delivery without compromising quality." },
              { icon: "🤝", title: "Personalized Service", desc: "Every client is unique. We provide customized solutions tailored to your specific business requirements and goals." }
            ].map((item, index) => (
              <ScrollAnimation key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-xl text-center hover:shadow-lg transition-all"
                >
                  <span className="text-5xl mb-6 block">{item.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full" />
        </div>
        <div className="container mx-auto px-4 relative">
          <ScrollAnimation>
            <div className="text-center text-white max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Ready to Grow Your Business?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Partner with A S Gupta & Co for expert financial guidance. Let our experienced Chartered Accountants help you achieve your business goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-3.5 rounded-full font-bold hover:bg-blue-50 transition"
                >
                  Get Free Consultation <ArrowRight size={18} />
                </Link>
                <a
                  href={getPhoneLink(siteInfo.phone)}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/10 transition"
                >
                  📞 Call Us Now
                </a>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </>
  );
}
