import { useState } from 'react';
import { Target, Eye, Award } from 'lucide-react';

const sections = [
  {
    icon: Target,
    title: 'Our Mission',
    content: 'To provide exceptional financial and accounting services that empower businesses to make informed decisions and achieve sustainable growth. We are committed to delivering accurate, timely, and strategic financial insights that drive success.',
    color: 'blue'
  },
  {
    icon: Eye,
    title: 'Our Vision',
    content: 'To be the most trusted and preferred accounting and business advisory firm, recognized for our integrity, expertise, and commitment to client success. We envision a future where every business has access to professional financial guidance.',
    color: 'indigo'
  },
  {
    icon: Award,
    title: 'Our Values',
    content: 'Integrity, Excellence, Innovation, and Client-Centricity form the foundation of everything we do. We believe in building long-term relationships based on trust, delivering quality services, embracing new technologies, and always putting our clients first.',
    color: 'cyan'
  }
];

export default function MissionSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Drives Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our commitment to excellence and client success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className={`bg-${section.color}-600 w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h3>
                <p className={`text-gray-600 leading-relaxed transition-all duration-300 ${
                  isExpanded ? '' : 'line-clamp-3'
                }`}>
                  {section.content}
                </p>
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="mt-4 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
