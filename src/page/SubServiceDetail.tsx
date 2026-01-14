import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, ChevronRight, ArrowRight } from 'lucide-react';
import { servicesAPI } from '../services/api';
import ScrollAnimation from '../components/ScrollAnimattion';

// Color themes for different sub-services
const colorThemes = [
  { primary: 'from-blue-900', secondary: 'to-indigo-900', accent: 'blue', light: 'blue-400' },
  { primary: 'from-indigo-900', secondary: 'to-purple-900', accent: 'indigo', light: 'indigo-400' },
  { primary: 'from-cyan-900', secondary: 'to-blue-900', accent: 'cyan', light: 'cyan-400' },
  { primary: 'from-teal-900', secondary: 'to-cyan-900', accent: 'teal', light: 'teal-400' },
  { primary: 'from-blue-950', secondary: 'to-slate-900', accent: 'slate', light: 'slate-400' },
  { primary: 'from-violet-900', secondary: 'to-indigo-900', accent: 'violet', light: 'violet-400' },
  { primary: 'from-sky-900', secondary: 'to-blue-950', accent: 'sky', light: 'sky-400' },
  { primary: 'from-blue-900', secondary: 'to-teal-900', accent: 'teal', light: 'teal-300' },
];

// Animation pattern types
const patternTypes = ['waves', 'circles', 'geometric', 'mesh', 'particles', 'hexagons', 'diamonds', 'lines'];

// Generate unique theme based on slug
const getThemeFromSlug = (slug: string) => {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const themeIndex = Math.abs(hash) % colorThemes.length;
  const patternIndex = Math.abs(hash >> 4) % patternTypes.length;
  return {
    colors: colorThemes[themeIndex],
    pattern: patternTypes[patternIndex],
    seed: Math.abs(hash)
  };
};

// Animated Background Component
const AnimatedBackground = ({ pattern, seed }: { pattern: string; seed: number }) => {
  // Generate positions based on seed for consistent but unique layouts
  const getPosition = (index: number, offset: number = 0) => ({
    x: ((seed + index * 137 + offset) % 100),
    y: ((seed + index * 173 + offset * 2) % 100),
  });

  const renderPattern = () => {
    switch (pattern) {
      case 'waves':
        return (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-[200%] h-40 opacity-10"
                style={{
                  top: `${20 + i * 25}%`,
                  left: '-50%',
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`,
                  borderRadius: '50%',
                }}
                animate={{
                  x: ['-10%', '10%', '-10%'],
                  y: [0, i % 2 === 0 ? 20 : -20, 0],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.5,
                }}
              />
            ))}
          </>
        );

      case 'circles':
        return (
          <>
            {[0, 1, 2, 3, 4].map((i) => {
              const pos = getPosition(i);
              const size = 100 + (seed % 150) + i * 50;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    background: `radial-gradient(circle, rgba(255,255,255,${0.03 + i * 0.02}) 0%, transparent 70%)`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                    x: [0, (i % 2 === 0 ? 30 : -30), 0],
                    y: [0, (i % 2 === 0 ? -20 : 20), 0],
                  }}
                  transition={{
                    duration: 6 + i * 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.3,
                  }}
                />
              );
            })}
          </>
        );

      case 'geometric':
        return (
          <>
            {[0, 1, 2, 3].map((i) => {
              const pos = getPosition(i, 50);
              return (
                <motion.div
                  key={i}
                  className="absolute border border-white/10"
                  style={{
                    width: 80 + i * 40,
                    height: 80 + i * 40,
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: `rotate(${45 + i * 15}deg)`,
                  }}
                  animate={{
                    rotate: [45 + i * 15, 90 + i * 15, 45 + i * 15],
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 10 + i * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.4,
                  }}
                />
              );
            })}
            {/* Triangles */}
            {[0, 1].map((i) => {
              const pos = getPosition(i + 10, 30);
              return (
                <motion.div
                  key={`tri-${i}`}
                  className="absolute"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: 0,
                    height: 0,
                    borderLeft: '40px solid transparent',
                    borderRight: '40px solid transparent',
                    borderBottom: '70px solid rgba(255,255,255,0.05)',
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 7 + i * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 1,
                  }}
                />
              );
            })}
          </>
        );

      case 'mesh':
        return (
          <>
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: `${40 + (seed % 30)}px ${40 + (seed % 30)}px`,
              }}
            />
            {[0, 1, 2].map((i) => {
              const pos = getPosition(i, 20);
              return (
                <motion.div
                  key={i}
                  className="absolute w-64 h-64 rounded-full"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)`,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.5,
                  }}
                />
              );
            })}
          </>
        );

      case 'particles':
        return (
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              const pos = getPosition(i);
              const size = 4 + (i % 4) * 3;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/20"
                  style={{
                    width: size,
                    height: size,
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    x: [0, (i % 2 === 0 ? 20 : -20), 0],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 5 + (i % 4) * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.3,
                  }}
                />
              );
            })}
            {/* Glowing orbs */}
            {[0, 1, 2].map((i) => {
              const pos = getPosition(i + 20);
              return (
                <motion.div
                  key={`orb-${i}`}
                  className="absolute w-32 h-32 rounded-full blur-2xl"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    background: 'rgba(255,255,255,0.08)',
                  }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 6 + i * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.8,
                  }}
                />
              );
            })}
          </>
        );

      case 'hexagons':
        return (
          <>
            {[0, 1, 2, 3].map((i) => {
              const pos = getPosition(i, 15);
              const size = 60 + i * 20;
              return (
                <motion.svg
                  key={i}
                  className="absolute"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: size,
                    height: size,
                  }}
                  viewBox="0 0 100 100"
                  animate={{
                    rotate: [0, 60, 0],
                    scale: [1, 1.1, 1],
                    opacity: [0.15, 0.3, 0.15],
                  }}
                  transition={{
                    duration: 12 + i * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.5,
                  }}
                >
                  <polygon
                    points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                  />
                </motion.svg>
              );
            })}
            {/* Center hexagon glow */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl bg-white/5"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        );

      case 'diamonds':
        return (
          <>
            {[0, 1, 2, 3, 4].map((i) => {
              const pos = getPosition(i, 25);
              const size = 40 + i * 15;
              return (
                <motion.div
                  key={i}
                  className="absolute border border-white/15"
                  style={{
                    width: size,
                    height: size,
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'rotate(45deg)',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                    y: [0, (i % 2 === 0 ? -20 : 20), 0],
                  }}
                  transition={{
                    duration: 7 + i * 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.4,
                  }}
                />
              );
            })}
            {/* Floating dots */}
            {[0, 1, 2].map((i) => {
              const pos = getPosition(i + 15);
              return (
                <motion.div
                  key={`dot-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-white/30"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                  }}
                  animate={{
                    y: [0, -40, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.6,
                  }}
                />
              );
            })}
          </>
        );

      case 'lines':
      default:
        return (
          <>
            {/* Animated diagonal lines */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{
                  width: '150%',
                  top: `${20 + i * 20}%`,
                  left: '-25%',
                  transform: `rotate(${-15 + (seed % 10)}deg)`,
                }}
                animate={{
                  x: ['-10%', '10%', '-10%'],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
              />
            ))}
            {/* Vertical accent lines */}
            {[0, 1, 2].map((i) => {
              const pos = getPosition(i, 40);
              return (
                <motion.div
                  key={`v-${i}`}
                  className="absolute w-px bg-gradient-to-b from-transparent via-white/15 to-transparent"
                  style={{
                    height: '80%',
                    left: `${pos.x}%`,
                    top: '10%',
                  }}
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scaleY: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 6 + i * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.5,
                  }}
                />
              );
            })}
            {/* Glow spots */}
            {[0, 1].map((i) => {
              const pos = getPosition(i + 10);
              return (
                <motion.div
                  key={`glow-${i}`}
                  className="absolute w-40 h-40 rounded-full blur-3xl bg-white/5"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 10 + i * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 1,
                  }}
                />
              );
            })}
          </>
        );
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {renderPattern()}
    </div>
  );
};

interface ImageData {
  data: string;
  contentType: string;
}

// Type for content sections
type ContentSection = { type: 'content'; html: string } | { type: 'image'; image: ImageData };

// Helper function to split content and intersperse images
const splitContentWithImages = (htmlContent: string, images: ImageData[]): ContentSection[] => {
  if (!images || images.length === 0) {
    return [{ type: 'content', html: htmlContent }];
  }

  // Split content by parsing HTML and distributing images throughout
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
  subServices: SubService[];
}

export default function SubServiceDetail() {
  const { serviceSlug, subServiceSlug } = useParams<{ serviceSlug: string; subServiceSlug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [subService, setSubService] = useState<SubService | null>(null);
  const [otherSubServices, setOtherSubServices] = useState<SubService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get unique theme based on sub-service slug
  const theme = useMemo(() =>
    getThemeFromSlug(subServiceSlug || 'default'),
    [subServiceSlug]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!serviceSlug || !subServiceSlug) return;

      setIsLoading(true);
      try {
        const response = await servicesAPI.getBySlug(serviceSlug);
        const serviceData = response.data.data || response.data;
        setService(serviceData);

        // Find the specific sub-service
        const foundSubService = serviceData.subServices?.find(
          (sub: SubService) => sub.slug === subServiceSlug
        );
        setSubService(foundSubService || null);

        // Get other sub-services for sidebar
        const others = serviceData.subServices?.filter(
          (sub: SubService) => sub.slug !== subServiceSlug && sub.isActive
        ) || [];
        setOtherSubServices(others);
      } catch (error) {
        console.error('Error fetching sub-service:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [serviceSlug, subServiceSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service || !subService) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-32 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sub-service not found</h1>
        <Link to="/services" className="text-blue-600 hover:text-blue-700">
          ← Back to Services
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section - Dynamic animated background unique for each sub-service */}
      <section className="relative min-h-[45vh] sm:min-h-[50vh] pt-32 sm:pt-36 md:pt-40 mt-16 sm:mt-20 md:mt-28 flex items-center overflow-hidden">
        {/* Dynamic Gradient Background based on theme */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.colors.primary} ${theme.colors.secondary}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

        {/* Dynamic Animated Background Pattern */}
        <AnimatedBackground pattern={theme.pattern} seed={theme.seed} />

        {/* Floating Animated Objects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large floating circle - top right */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[10%] right-[10%] w-20 h-20 border-2 border-white/20 rounded-full"
          />

          {/* Floating square - left side */}
          <motion.div
            animate={{
              y: [0, 40, 0],
              x: [0, -20, 0],
              rotate: [45, 90, 45],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-[30%] left-[8%] w-12 h-12 border-2 border-white/15 rotate-45"
          />

          {/* Small floating circle - bottom right */}
          <motion.div
            animate={{
              y: [0, -25, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-[25%] right-[15%] w-8 h-8 bg-white/10 rounded-full"
          />

          {/* Floating triangle - top left */}
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, 30, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-[20%] left-[20%]"
            style={{
              width: 0,
              height: 0,
              borderLeft: '20px solid transparent',
              borderRight: '20px solid transparent',
              borderBottom: '35px solid rgba(255,255,255,0.15)',
            }}
          />

          {/* Floating ring - center right */}
          <motion.div
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-[45%] right-[5%] w-16 h-16 border-4 border-white/10 rounded-full"
          />

          {/* Small floating dots */}
          {[
            { top: '15%', left: '30%', delay: 0 },
            { top: '60%', left: '12%', delay: 1 },
            { top: '35%', right: '25%', delay: 2 },
            { top: '70%', right: '8%', delay: 0.5 },
            { top: '25%', right: '35%', delay: 1.5 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: pos.delay,
              }}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{ top: pos.top, left: pos.left, right: pos.right }}
            />
          ))}

          {/* Floating plus signs */}
          <motion.div
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-[55%] left-[25%] text-white/20 text-3xl font-thin"
          >
            +
          </motion.div>

          <motion.div
            animate={{
              rotate: [360, 270, 180, 90, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-[20%] right-[20%] text-white/15 text-4xl font-thin"
          >
            +
          </motion.div>

          {/* Floating diamond */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [45, 90, 45],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="absolute bottom-[35%] left-[35%] w-10 h-10 border-2 border-white/20 rotate-45"
          />

          {/* Large blurred floating orbs */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl bg-white/10"
          />

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.08, 0.15, 0.08],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl bg-white/10"
          />

          {/* Floating hexagon outline */}
          <motion.svg
            animate={{
              rotate: [0, 60, 0],
              y: [0, -20, 0],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-[40%] left-[5%] w-14 h-14"
            viewBox="0 0 100 100"
          >
            <polygon
              points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
          </motion.svg>

          {/* Animated lines */}
          <motion.div
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0,
            }}
            className="absolute top-[30%] right-[30%] w-20 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />

          <motion.div
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-[50%] left-[40%] w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent"
          />
        </div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            {/* Breadcrumb with enhanced styling */}
            <motion.nav
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap"
            >
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link to="/services" className="hover:text-white transition-colors">Services</Link>
              <ChevronRight size={14} />
              <Link to={`/services/${service.slug}`} className="hover:text-white transition-colors">
                {service.title}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white font-medium">{subService.title}</span>
            </motion.nav>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 mb-4 border border-white/10"
            >
              Professional CA Services
            </motion.div>

            {/* Title with stagger animation */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg"
            >
              {subService.title}
            </motion.h1>

            {subService.shortDescription && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-lg sm:text-xl text-white/85 max-w-3xl drop-shadow-md"
              >
                {subService.shortDescription}
              </motion.p>
            )}

            {/* Decorative underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-6 h-1 w-24 rounded-full origin-left"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.8), rgba(255,255,255,0.3))'
              }}
            />
          </motion.div>
        </div>

        {/* Bottom shadow/fade effect */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <ScrollAnimation>
                <div className="mb-6">
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <ArrowLeft size={18} />
                    Back to {service.title}
                  </Link>
                </div>

                {/* Content with Interspersed Images */}
                {splitContentWithImages(subService.content, subService.images || []).map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {section.type === 'content' && section.html && (
                      <div
                        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-blue-600 prose-strong:text-gray-900"
                        dangerouslySetInnerHTML={{ __html: section.html }}
                      />
                    )}
                    {section.type === 'image' && section.image && (
                      <div className="my-8 flex justify-center">
                        <div className="max-w-xl w-full rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={`data:${section.image.contentType};base64,${section.image.data}`}
                            alt={`${subService.title} - Image ${index + 1}`}
                            className="w-full h-auto max-h-72 object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </ScrollAnimation>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Other Sub-services */}
              {otherSubServices.length > 0 && (
                <ScrollAnimation delay={0.1}>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6 sticky top-32">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                      Related Services
                    </h3>
                    <ul className="space-y-2">
                      {otherSubServices.map((sub) => (
                        <li key={sub._id}>
                          <Link
                            to={`/services/${service.slug}/${sub.slug}`}
                            className="flex items-center gap-2 py-2 text-gray-600 hover:text-blue-600 transition-colors group"
                          >
                            <ArrowRight size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Link
                        to={`/services/${service.slug}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View All {service.title} Services →
                      </Link>
                    </div>
                  </div>
                </ScrollAnimation>
              )}

              {/* Contact Card */}
              <ScrollAnimation delay={0.2}>
                <div className="bg-blue-900 text-white rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3">Need Assistance?</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Contact our experts for professional guidance on {subService.title}.
                  </p>
                  <div className="space-y-3">
                    <a
                      href="tel:+919034059226"
                      className="flex items-center gap-3 text-white hover:text-blue-200 transition-colors"
                    >
                      <Phone size={18} />
                      <span>+91 90340 59226</span>
                    </a>
                    <Link
                      to="/contact"
                      className="block w-full bg-white text-blue-900 py-2.5 rounded-lg text-center font-semibold hover:bg-blue-50 transition-colors mt-4"
                    >
                      Get Free Consultation
                    </Link>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 sm:p-12 text-center text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Ready to Get Started with {subService.title}?
              </h2>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                Our team of experienced professionals is here to help you every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all"
                >
                  Contact Us <ArrowRight size={18} />
                </Link>
                <a
                  href="tel:+919034059226"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all"
                >
                  <Phone size={18} /> Call Now
                </a>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </>
  );
}
