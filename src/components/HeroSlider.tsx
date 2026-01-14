import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from "react-router-dom";
const slides = [
  {
    title: 'Professional Accounting Services',
    description: 'Expert financial solutions tailored to your business needs',
    image: 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=1920'
  },
  {
    title: 'Tax Planning & Compliance',
    description: 'Strategic tax solutions to optimize your financial position',
    image: 'https://images.pexels.com/photos/7841468/pexels-photo-7841468.jpeg?auto=compress&cs=tinysrgb&w=1920'
  },
  {
    title: 'Business Advisory Services',
    description: 'Navigate complex business challenges with confidence',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1920'
  }
];

/* ✅ Extra-smooth checkerboard */
function CheckerboardTransition({ active }: { active: boolean }) {
  const rows = 7;
  const cols = 12;

  return (
    <div
      className="absolute inset-0 z-20 grid pointer-events-none"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;

        return (
          <div
            key={i}
            className={`
              bg-blue-900
              transition-all
              duration-[1400ms]
              ease-[cubic-bezier(0.4,0,0.2,1)]
              ${active ? 'opacity-0 scale-100' : 'opacity-100 scale-105'}
            `}
            style={{
              transitionDelay: `${(row + col) * 90}ms`
            }}
          />
        );
      })}
    </div>
  );
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000); // ⏳ slower auto-slide

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[600px] pt-36 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-20' : 'opacity-0 z-10'
          }`}
        >
          {/* Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover scale-105"
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/50 z-10" />

          {/* Checkerboard */}
          <CheckerboardTransition active={index === currentSlide} />

          {/* Content */}
          <div className="absolute inset-0 z-30 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl ml-8 sm:ml-12 md:ml-16">
                <h2 className="text-5xl font-bold text-white mb-4 transition-all duration-1000 delay-[900ms]">
                  {slide.title}
                </h2>
                <p className="text-xl text-white/90 mb-8 transition-all duration-1000 delay-[1100ms]">
                  {slide.description}
                </p>
                

                <Link to="/contact">
                  <button className="
                    bg-white text-blue-900 px-8 py-3 rounded-full font-semibold
                    transition-all duration-300
                    hover:bg-blue-700 hover:text-white
                    hover:scale-105 hover:shadow-lg
                  ">
                    Contact Us
                  </button>
                </Link>

              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
