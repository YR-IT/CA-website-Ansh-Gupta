import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { servicesAPI, aboutUsAPI } from '../services/api';

interface Service {
  _id: string;
  title: string;
  slug: string;
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

export default function Footer() {
  const [services, setServices] = useState<Service[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: '',
    phone: '',
    email: '',
    workingHours: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, aboutUsRes] = await Promise.all([
          servicesAPI.getAll(1, 6),
          aboutUsAPI.get()
        ]);
        setServices(servicesRes.data.data || servicesRes.data);
        if (aboutUsRes.data.success && aboutUsRes.data.data) {
          const { address, phone, email, workingHours } = aboutUsRes.data.data;
          setContactInfo({ address, phone, email, workingHours });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'FAQs', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold">A S GUPTA AND CO</h3>
              <p className="text-blue-400 text-sm font-medium">Chartered Accountants</p>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A professionally managed Chartered Accountancy firm providing comprehensive accounting, taxation, audit, and advisory services.
            </p>
            {contactInfo.workingHours && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock size={16} />
                <span>{contactInfo.workingHours}</span>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-5 relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-blue-500 -mb-2"></span>
            </h4>
            <ul className="space-y-3 mt-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-200 text-sm flex items-center gap-1 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-5 relative">
              Our Services
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-blue-500 -mb-2"></span>
            </h4>
            <ul className="space-y-3 mt-4">
              {services.slice(0, 5).map((service) => (
                <li key={service._id}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-200 text-sm flex items-center gap-1 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/services"
                  className="text-blue-400 hover:text-blue-300 transition text-sm font-medium"
                >
                  View All Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-5 relative">
              Contact Us
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-blue-500 -mb-2"></span>
            </h4>
            <ul className="space-y-4 mt-4">
              {contactInfo.address && (
                <li className="flex gap-3 text-gray-400 text-sm">
                  <MapPin size={18} className="flex-shrink-0 mt-0.5 text-blue-400" />
                  <span>{contactInfo.address}</span>
                </li>
              )}
              {contactInfo.phone && (
                <li>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                    className="flex gap-3 text-gray-400 hover:text-white transition text-sm"
                  >
                    <Phone size={18} className="flex-shrink-0 text-blue-400" />
                    {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo.email && (
                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex gap-3 text-gray-400 hover:text-white transition text-sm"
                  >
                    <Mail size={18} className="flex-shrink-0 text-blue-400" />
                    {contactInfo.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} A S GUPTA AND CO. Made with ❤️ and sugar.</p>
            <p>
              Designed and developed by{' '}
              <a
                href="https://yritsolutions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition font-medium"
              >
                YR IT SOLUTIONS
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
