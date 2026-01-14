import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Scale, BookOpen, Briefcase, Users, Award, Target, Eye,
  CheckCircle, MapPin, Phone, Mail, Clock, Shield, TrendingUp,
  Building, Heart, Star, Lightbulb
} from "lucide-react";
import ScrollAnimation from "../components/ScrollAnimattion";
import { Link } from "react-router-dom";
import { aboutUsAPI } from "../services/api";

interface CoreValue {
  title: string;
  description: string;
  icon: string;
}

interface TeamMember {
  name: string;
  designation: string;
  description: string;
  image?: { data: string; contentType: string };
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
  teamMembers: TeamMember[];
  whyChooseUsTitle: string;
  whyChooseUsPoints: WhyChoosePoint[];
  serviceAreas: ServiceArea[];
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  Shield, Target, Heart, TrendingUp, Award, Users, Clock,
  Building, Briefcase, Star, CheckCircle, Lightbulb, BookOpen, Scale, Eye
};

// Default team data (used when no API data)
const defaultTeamMembers = [
  {
    icon: BookOpen,
    title: "Chartered Accountant (CA) Team",
    color: "from-blue-500 to-blue-600",
    description: "The Chartered Accountant team at A S GUPTA AND CO forms the backbone of our professional services. Our CA professionals specialize in Direct and Indirect Taxation, GST compliance and refunds, income tax advisory, accounting and bookkeeping, statutory and tax audits, and financial reporting.",
    highlights: [
      "Direct & Indirect Taxation",
      "GST Compliance & Refunds",
      "Statutory & Tax Audits",
      "Financial Reporting",
      "International Taxation"
    ]
  },
  {
    icon: Scale,
    title: "Legal (Advocate) Team",
    color: "from-purple-500 to-purple-600",
    description: "Our Legal team of experienced Advocates provides comprehensive support in taxation and corporate legal matters. The team assists clients in GST and income tax litigation, drafting and replying to notices, representations before tax authorities, and handling appeals.",
    highlights: [
      "GST & Income Tax Litigation",
      "Legal Notices & Replies",
      "Tax Authority Representations",
      "Appeals Handling",
      "Corporate Legal Advisory"
    ]
  },
  {
    icon: Briefcase,
    title: "Company Secretary (CS) Team",
    color: "from-teal-500 to-teal-600",
    description: "The Company Secretary team at A S GUPTA AND CO handles all aspects of corporate law and regulatory compliance. Their expertise includes company incorporation, ROC filings, annual compliances, corporate governance, secretarial audits, and advisory under the Companies Act.",
    highlights: [
      "Company Incorporation",
      "ROC Filings & Compliance",
      "Corporate Governance",
      "Secretarial Audits",
      "FEMA Compliance"
    ]
  }
];

const clientTypes = [
  { icon: Building, label: "Corporates & Companies" },
  { icon: Briefcase, label: "Startups & MSMEs" },
  { icon: Users, label: "Partnership Firms & LLPs" },
  { icon: Star, label: "High Net Worth Individuals" }
];

export default function AboutSection() {
  const [aboutData, setAboutData] = useState<AboutUsData | null>(null);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const response = await aboutUsAPI.get();
        if (response.data.success) {
          setAboutData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching about us:', error);
      }
    };

    fetchAboutUs();
  }, []);

  // Values from API - use empty/null as fallback for conditional rendering
  const heroTitle = aboutData?.heroTitle || "";
  const heroSubtitle = aboutData?.heroSubtitle || "";
  const storyContent = aboutData?.storyContent || "";
  const missionContent = aboutData?.missionContent || "";
  const visionContent = aboutData?.visionContent || "";
  const coreValues = aboutData?.coreValues || [];
  const whyChooseUsPoints = aboutData?.whyChooseUsPoints || [];
  const serviceAreas = aboutData?.serviceAreas?.filter(a => a.isActive) || [];
  const address = aboutData?.address || "";
  const phone = aboutData?.phone || "";
  const email = aboutData?.email || "";

  // Check if sections have content
  const hasHero = heroTitle.trim().length > 0 || heroSubtitle.trim().length > 0;
  const hasStory = storyContent.trim().length > 0;
  const hasMissionOrVision = missionContent.trim().length > 0 || visionContent.trim().length > 0;
  const hasCoreValues = coreValues.length > 0;
  const hasWhyChooseUs = whyChooseUsPoints.length > 0;
  const hasServiceAreas = serviceAreas.length > 0;
  const hasContactInfo = address.trim().length > 0 || phone.trim().length > 0 || email.trim().length > 0;

  return (
    <>
      {/* HERO SECTION */}
      {hasHero && (
        <ScrollAnimation>
          <section
            className="pt-24 sm:pt-32 md:pt-36 mt-20 sm:mt-28 md:mt-36 pb-16 sm:pb-20 md:pb-24 bg-cover bg-center relative"
            style={{ backgroundImage: "url('/about.jpg')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80"></div>

            <div className="relative container mx-auto px-4 text-center text-white max-w-4xl">
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4"
              >
                Professional CA Firm
              </motion.span>
              {heroTitle && (
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
                >
                  {heroTitle}
                </motion.h1>
              )}
              {heroSubtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto"
                >
                  {heroSubtitle}
                </motion.p>
              )}
            </div>
          </section>
        </ScrollAnimation>
      )}

      {/* ABOUT STORY */}
      {hasStory && (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
              <ScrollAnimation>
                <div>
                  <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                    Our Story
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Professional <span className="text-blue-600">Excellence</span>
                  </h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>{storyContent}</p>
                    <p>
                      With a strong focus on <strong>accuracy, integrity, and client satisfaction</strong>,
                      we assist individuals, startups, SMEs, and corporates in achieving financial clarity,
                      statutory compliance, and sustainable business growth.
                    </p>
                    <p>
                      At A S GUPTA AND CO, we believe every client's business is unique. We deliver
                      <strong> customized, cost-effective, and result-oriented</strong> advice with the
                      highest professional ethics.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link
                      to="/services"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                    >
                      Our Services
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
                    >
                      Get in Touch
                    </Link>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.2}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Award, label: "Expert Team", desc: "Qualified professionals", color: "bg-blue-600" },
                    { icon: Users, label: "Client Focused", desc: "Personalized attention", color: "bg-green-600" },
                    { icon: CheckCircle, label: "Full Compliance", desc: "Statutory requirements", color: "bg-purple-600" },
                    { icon: Star, label: "Quality Service", desc: "Excellence guaranteed", color: "bg-amber-500" }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-gray-50 p-5 sm:p-6 rounded-xl hover:shadow-lg transition-all text-center"
                    >
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">{stat.label}</h4>
                      <p className="text-gray-600 text-sm mt-1">{stat.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>
      )}

      {/* MISSION & VISION */}
      {hasMissionOrVision && (
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="text-center mb-10 sm:mb-12">
                <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                  Our Purpose
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Mission & Vision
                </h2>
              </div>
            </ScrollAnimation>

            <div className={`grid ${missionContent && visionContent ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-2xl'} gap-6 sm:gap-8 max-w-5xl mx-auto`}>
              {missionContent && (
                <ScrollAnimation>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 sm:p-8 md:p-10 rounded-2xl h-full"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center mb-5 sm:mb-6">
                      <Target className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Our Mission</h3>
                    <p className="text-white/90 leading-relaxed text-sm sm:text-base md:text-lg">
                      {missionContent}
                    </p>
                  </motion.div>
                </ScrollAnimation>
              )}

              {visionContent && (
                <ScrollAnimation delay={0.2}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-6 sm:p-8 md:p-10 rounded-2xl h-full"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center mb-5 sm:mb-6">
                      <Eye className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Our Vision</h3>
                    <p className="text-white/90 leading-relaxed text-sm sm:text-base md:text-lg">
                      {visionContent}
                    </p>
                  </motion.div>
                </ScrollAnimation>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CORE VALUES */}
      {hasCoreValues && (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="text-center mb-10 sm:mb-12">
                <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                  What We Stand For
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Our Core Values
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  The principles that guide every decision we make and every service we deliver
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {coreValues.map((value, index) => {
                const IconComp = iconMap[value.icon] || Shield;
                return (
                  <ScrollAnimation key={index} delay={index * 0.1}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-lg transition-all h-full"
                    >
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <IconComp className="w-7 h-7 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </motion.div>
                  </ScrollAnimation>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* OUR TEAM SECTION */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
              >
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                {aboutData?.teamTitle || "Our Expert Team"}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                {aboutData?.teamSubtitle || "By bringing together Chartered Accountants, Advocates, and Company Secretaries under one roof, A S GUPTA AND CO delivers seamless, end-to-end professional solutions."}
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {defaultTeamMembers.map((team, index) => {
              const Icon = team.icon;
              return (
                <ScrollAnimation key={index} delay={index * 0.15}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-2xl p-6 sm:p-8 h-full border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
                  >
                    <motion.div
                      initial={{ rotate: -10 }}
                      whileInView={{ rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, delay: index * 0.1 }}
                      className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${team.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </motion.div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                      {team.title}
                    </h3>

                    <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                      {team.description}
                    </p>

                    <div className="space-y-2">
                      {team.highlights.map((highlight, hIndex) => (
                        <motion.div
                          key={hIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: (index * 0.15) + (hIndex * 0.1) }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{highlight}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </ScrollAnimation>
              );
            })}
          </div>

          {/* Integrated Approach */}
          <ScrollAnimation delay={0.3}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 sm:mt-12 md:mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 md:p-12 text-white text-center max-w-4xl mx-auto"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Our Integrated Approach</h3>
              <p className="text-white/90 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base">
                By bringing together Chartered Accountants, Advocates, and Company Secretaries under one roof,
                A S GUPTA AND CO delivers seamless, end-to-end professional solutions. This integrated structure
                allows us to provide clients with coordinated advice, faster execution, and holistic support
                across taxation, legal, and corporate compliance matters.
              </p>
            </motion.div>
          </ScrollAnimation>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="text-center mb-10 sm:mb-12">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                Our Clients
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Who We Serve
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We cater to diverse client segments with tailored solutions
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {clientTypes.map((client, index) => (
              <ScrollAnimation key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="bg-gray-50 p-5 sm:p-6 rounded-xl text-center hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <client.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">{client.label}</p>
                </motion.div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      {hasServiceAreas && (
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="text-center mb-10 sm:mb-12">
                <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                  Coverage Area
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Areas We Serve
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Providing professional services across Tricity and beyond
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {serviceAreas.map((area, index) => (
                <ScrollAnimation key={index} delay={index * 0.05}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-all"
                  >
                    <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">{area.city}</p>
                  </motion.div>
                </ScrollAnimation>
              ))}
            </div>

            <ScrollAnimation delay={0.2}>
              <p className="text-center text-gray-600 mt-6 text-sm">
                <span className="font-semibold">Also serving clients:</span> Pan-India through virtual consultations
              </p>
            </ScrollAnimation>
          </div>
        </section>
      )}

      {/* WHY CHOOSE US */}
      {hasWhyChooseUs && (
        <section className="py-12 sm:py-16 md:py-20 bg-blue-900 text-white">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                  {aboutData?.whyChooseUsTitle || "Why Choose A S GUPTA AND CO"}
                </h2>
                <p className="text-white/80 max-w-2xl mx-auto">
                  Trusted by clients for our commitment to excellence
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {whyChooseUsPoints.map((item, index) => {
                const IconComp = iconMap[item.icon] || Award;
                return (
                  <ScrollAnimation key={index} delay={index * 0.1}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="text-center"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <IconComp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-white/80 text-sm sm:text-base">{item.description}</p>
                    </motion.div>
                  </ScrollAnimation>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT INFO */}
      {hasContactInfo && (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-6 sm:p-8 md:p-10">
              <ScrollAnimation>
                <div className="text-center mb-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Get in Touch
                  </h2>
                  <p className="text-gray-600">
                    Ready to discuss your requirements? Contact us today.
                  </p>
                </div>
              </ScrollAnimation>

              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { icon: MapPin, label: "Address", value: address },
                  { icon: Phone, label: "Phone", value: phone },
                  { icon: Mail, label: "Email", value: email }
                ].filter(c => c.value.trim()).map((contact, index) => (
                  <ScrollAnimation key={index} delay={index * 0.1}>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <contact.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">{contact.label}</p>
                      <p className="text-gray-600 text-sm">{contact.value}</p>
                    </div>
                  </ScrollAnimation>
                ))}
              </div>

              <ScrollAnimation delay={0.3}>
                <div className="text-center mt-8">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                  >
                    Contact Us Now
                  </Link>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
