import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';
import { servicesAPI } from '../services/api';
import { useSiteInfo, getPhoneLink } from '../context/SiteContext';

interface ImageData {
  data: string;
  contentType: string;
}

interface SubService {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  content: string;
  isActive: boolean;
  order: number;
  images?: ImageData[];
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  icon: string;
  image: {
    data: string;
    contentType: string;
  };
  images?: ImageData[];
  subServices?: SubService[];
}

// Type for content sections
type ContentSection = { type: 'content'; html: string } | { type: 'image'; image: ImageData };

// Helper function to split content and intersperse images
const splitContentWithImages = (htmlContent: string, images: ImageData[]): ContentSection[] => {
  if (!images || images.length === 0) {
    return [{ type: 'content', html: htmlContent }];
  }

  // Split content by major headings (h2, h3) or after every few paragraphs
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const elements = Array.from(doc.body.children);

  if (elements.length === 0) {
    return [{ type: 'content', html: htmlContent }];
  }

  const sections: ContentSection[] = [];
  let currentHtml = '';
  let imageIndex = 0;
  let elementCount = 0;

  // Calculate how to distribute images
  const totalElements = elements.length;
  const imageCount = images.length;
  const elementsPerImage = Math.ceil(totalElements / (imageCount + 1));

  elements.forEach((element, index) => {
    currentHtml += element.outerHTML;
    elementCount++;

    // Insert image after certain elements or at major breaks
    const isHeading = element.tagName === 'H2' || element.tagName === 'H3';
    const shouldInsertImage = imageIndex < imageCount && (
      (elementCount >= elementsPerImage && !isHeading) ||
      (index === elements.length - 1 && imageIndex < imageCount)
    );

    if (shouldInsertImage && currentHtml.trim()) {
      sections.push({ type: 'content', html: currentHtml });
      sections.push({ type: 'image', image: images[imageIndex] });
      currentHtml = '';
      elementCount = 0;
      imageIndex++;
    }
  });

  // Add remaining content
  if (currentHtml.trim()) {
    sections.push({ type: 'content', html: currentHtml });
  }

  // Add remaining images at the end if any
  while (imageIndex < imageCount) {
    sections.push({ type: 'image', image: images[imageIndex] });
    imageIndex++;
  }

  return sections;
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { siteInfo } = useSiteInfo();

  useEffect(() => {
    if (slug) {
      fetchService(slug);
      fetchAllServices();
    }
  }, [slug]);

  const fetchService = async (serviceSlug: string) => {
    try {
      const response = await servicesAPI.getBySlug(serviceSlug);
      setService(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Service not found');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setAllServices(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-40 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="pt-40 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The service you are looking for does not exist.'}</p>
          <Link to="/services" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
            <ArrowLeft size={20} /> Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = service.image?.data
    ? `data:${service.image.contentType};base64,${service.image.data}`
    : 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1920';

  const activeSubServices = service.subServices?.filter(sub => sub.isActive).sort((a, b) => a.order - b.order) || [];
  const hasSubServices = activeSubServices.length > 0;
  const otherServices = allServices.filter(s => s.slug !== slug);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[45vh] sm:h-[50vh] md:h-[55vh] pt-28 sm:pt-32 md:pt-24 flex items-center justify-center overflow-hidden">
        <img src={imageUrl} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/70 to-blue-900/80" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4 max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4"
          >
            Professional CA Services
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{service.title}</h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto">{service.shortDescription}</p>
        </motion.div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-blue-600 transition">Services</Link>
            <span>/</span>
            <span className="text-blue-600 font-medium">{service.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Service Content with Interspersed Images */}
            {splitContentWithImages(service.content, service.images || []).map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {section.type === 'content' && section.html && (
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-blue-900 prose-headings:font-bold prose-p:text-gray-600 prose-a:text-blue-600 prose-li:text-gray-600"
                    dangerouslySetInnerHTML={{ __html: section.html }}
                  />
                )}
                {section.type === 'image' && section.image && (
                  <div className="my-8 flex justify-center">
                    <div className="max-w-2xl w-full rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={`data:${section.image.contentType};base64,${section.image.data}`}
                        alt={`${service.title} - Image ${index + 1}`}
                        className="w-full h-auto max-h-80 object-cover"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Sub-Services Section - Now Links to Individual Pages */}
            {hasSubServices && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-12"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
                  Our {service.title} Services
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSubServices.map((subService, index) => (
                    <motion.div
                      key={subService._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Link
                        to={`/services/${service.slug}/${subService.slug}`}
                        className="group block bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                              {subService.title}
                            </h3>
                            {subService.shortDescription && (
                              <p className="text-gray-600 text-sm line-clamp-2">{subService.shortDescription}</p>
                            )}
                            <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                              Learn More <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Why Choose A S Gupta & Co?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Trusted by businesses across India for professional CA services</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: "👨‍💼", title: "Expert CAs", desc: "Qualified professionals with years of experience" },
              { icon: "⚡", title: "Quick Turnaround", desc: "Efficient service delivery within timelines" },
              { icon: "💰", title: "Competitive Pricing", desc: "Quality services at reasonable rates" },
              { icon: "🤝", title: "Dedicated Support", desc: "Personal attention to every client" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl text-center hover:shadow-md transition-shadow"
              >
                <span className="text-4xl mb-3 block">{item.icon}</span>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Need {service.title} Services?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Get expert assistance from our experienced Chartered Accountants. Contact us today for a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-block bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
              >
                Get Free Consultation
              </Link>
              <a
                href={getPhoneLink(siteInfo.phone)}
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
              >
                <Phone size={18} /> Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other Services - Full Width Grid at Bottom */}
      {otherServices.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Explore Our Other Services</h2>
              <p className="text-gray-600">Comprehensive CA services for all your business needs</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherServices.slice(0, 8).map((otherService, index) => (
                <motion.div
                  key={otherService._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/services/${otherService.slug}`}
                    className="group block bg-gray-50 hover:bg-blue-50 p-6 rounded-xl transition-all duration-300 hover:shadow-lg border border-transparent hover:border-blue-200 h-full"
                  >
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {otherService.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{otherService.shortDescription}</p>
                    <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                      Learn More <ChevronRight size={14} />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
              >
                View All Services <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
