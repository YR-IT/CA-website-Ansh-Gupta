import { useState, useEffect, useRef } from "react";
import { Menu, X, Mail, Phone, ChevronDown, ChevronRight } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { servicesAPI, aboutUsAPI } from "../services/api";

interface SubService {
  title: string;
  slug: string;
  shortDescription: string;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  subServices: SubService[];
}

interface ContactInfo {
  phone: string;
  email: string;
}

// Links that appear after Services dropdown (used in both desktop and mobile)
const navLinksAfterServices = [
  { to: "/blogs", label: "Blogs" },
  { to: "/about", label: "About Us" },
  { to: "/faq", label: "FAQs" }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [activeService, setActiveService] = useState<number | null>(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ phone: '', email: '' });
  const servicesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch services and contact info from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, aboutUsRes] = await Promise.all([
          servicesAPI.getAll(),
          aboutUsAPI.get()
        ]);
        setServices(servicesRes.data.data || servicesRes.data);
        if (aboutUsRes.data.success && aboutUsRes.data.data) {
          const { phone, email } = aboutUsRes.data.data;
          setContactInfo({ phone, email });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
        setActiveService(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  const handleServiceClick = (slug: string) => {
    navigate(`/services/${slug}`);
    setIsServicesOpen(false);
    setActiveService(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* TOP BAR */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          {contactInfo.email && (
            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 hover:text-blue-200 transition-colors">
              <Mail size={14} /> {contactInfo.email}
            </a>
          )}
          {contactInfo.phone && (
            <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-blue-200 transition-colors">
              <Phone size={14} /> {contactInfo.phone}
            </a>
          )}
        </div>
      </div>

      {/* MAIN NAV */}
      <nav
        className={`bg-white transition-all duration-300 ${
          isScrolled ? "shadow-lg py-2" : "py-3"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* LOGO + COMPANY NAME */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" className="h-12 transition-transform group-hover:scale-105" alt="CA Logo" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-blue-900 leading-tight">A S GUPTA AND CO</h1>
              <p className="text-xs text-gray-500 font-medium">Chartered Accountants</p>
            </div>
          </NavLink>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-11 font-medium">
            {/* Home Link */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative py-2 transition-all duration-300
                ${isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"}`
              }
            >
              {({ isActive }) => (
                <>
                  Home
                  <span
                    className={`absolute left-0 -bottom-0 h-[2px] w-full bg-blue-600 transition-transform duration-300 origin-left
                    ${isActive ? "scale-x-100" : "scale-x-0 hover:scale-x-100"}`}
                  />
                </>
              )}
            </NavLink>

            {/* SERVICES DROPDOWN - Between Home and other links */}
            <div
              ref={servicesRef}
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => {
                setIsServicesOpen(false);
                setActiveService(null);
              }}
            >
              <button
                className={`flex items-center gap-1 py-2 transition-all duration-300 ${
                  isServicesOpen ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Services
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* MEGA DROPDOWN - Like Reference Site */}
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-1"
                  >
                    {/* Main Services Panel */}
                    <div className="bg-white shadow-xl rounded-lg border border-gray-200 w-[240px]">
                      <div className="py-2">
                        {services.map((service, index) => (
                          <div
                            key={service._id}
                            className="relative"
                            onMouseEnter={() => setActiveService(index)}
                          >
                            <button
                              onClick={() => handleServiceClick(service.slug)}
                              className={`w-full px-5 py-2.5 text-left flex items-center justify-between transition-all duration-100 ${
                                activeService === index
                                  ? "bg-blue-600 text-white"
                                  : "hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              <span className="font-medium text-[14px]">{service.title}</span>
                              {service.subServices && service.subServices.length > 0 && (
                                <ChevronRight size={16} className={activeService === index ? 'text-white' : 'text-gray-400'} />
                              )}
                            </button>

                            {/* Sub-services Panel - Appears to the right */}
                            {activeService === index && service.subServices && service.subServices.length > 0 && (
                              <div className="absolute left-full top-0 ml-0 bg-white shadow-xl rounded-lg border border-gray-200 w-[220px] z-[100]">
                                <div className="py-2">
                                  {service.subServices.map((sub, subIndex) => (
                                    <button
                                      key={subIndex}
                                      onClick={() => {
                                        navigate(`/services/${service.slug}/${sub.slug}`);
                                        setIsServicesOpen(false);
                                        setActiveService(null);
                                      }}
                                      className="w-full px-5 py-2.5 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-100 text-[14px]"
                                    >
                                      {sub.title}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* VIEW ALL SERVICES */}
                      <div className="border-t border-gray-200">
                        <NavLink
                          to="/services"
                          onClick={() => setIsServicesOpen(false)}
                          className="block px-5 py-2.5 text-center text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-100 text-[14px]"
                        >
                          View All Services →
                        </NavLink>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Links after Services: Blogs, About Us, FAQs */}
            {navLinksAfterServices.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative py-2 transition-all duration-300
                  ${isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"}`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={`absolute left-0 -bottom-0 h-[2px] w-full bg-blue-600 transition-transform duration-300 origin-left
                      ${isActive ? "scale-x-100" : "scale-x-0 hover:scale-x-100"}`}
                    />
                  </>
                )}
              </NavLink>
            ))}

            {/* CTA BUTTON */}
            <NavLink
              to="/contact"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Contact Us
            </NavLink>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={closeMenu}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* MOBILE HEADER */}
              <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-blue-900">A S GUPTA AND CO</h2>
                  <p className="text-xs text-gray-500">Chartered Accountants</p>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* MOBILE LINKS */}
              <div className="p-4 space-y-1">
                {/* Home Link */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0 }}
                >
                  <NavLink
                    to="/"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block py-3 px-4 rounded-lg transition-all duration-200
                      ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-gray-50"}`
                    }
                  >
                    Home
                  </NavLink>
                </motion.div>

                {/* MOBILE SERVICES ACCORDION - After Home */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full py-3 px-4 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-all duration-200"
                  >
                    <span>Services</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 py-2 space-y-1">
                          {services.map((service) => (
                            <NavLink
                              key={service._id}
                              to={`/services/${service.slug}`}
                              onClick={closeMenu}
                              className="block py-2.5 px-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                              {service.title}
                            </NavLink>
                          ))}
                          <NavLink
                            to="/services"
                            onClick={closeMenu}
                            className="block py-2.5 px-4 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-all duration-200"
                          >
                            View All Services →
                          </NavLink>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Remaining Links: Blogs, About Us, FAQs */}
                {navLinksAfterServices.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 2) * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `block py-3 px-4 rounded-lg transition-all duration-200
                        ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-gray-50"}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}

                {/* MOBILE CTA */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4"
                >
                  <NavLink
                    to="/contact"
                    onClick={closeMenu}
                    className="block bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-full text-center font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                  >
                    Contact Us
                  </NavLink>
                </motion.div>
              </div>

              {/* MOBILE CONTACT INFO */}
              <div className="p-4 mt-4 border-t border-gray-100 space-y-3">
                {contactInfo.email && (
                  <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
                    <Mail size={18} />
                    <span className="text-sm">{contactInfo.email}</span>
                  </a>
                )}
                {contactInfo.phone && (
                  <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
                    <Phone size={18} />
                    <span className="text-sm">{contactInfo.phone}</span>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
