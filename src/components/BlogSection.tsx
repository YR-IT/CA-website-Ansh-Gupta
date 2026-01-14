import { useState, useEffect } from "react";
import { Calendar, User, ArrowRight, BookOpen, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { blogsAPI } from "../services/api";
import Pagination from "./Pagination";
import ScrollAnimation from "./ScrollAnimattion";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  image: {
    data: string;
    contentType: string;
  };
  createdAt: string;
  isFeatured: boolean;
}

interface Category {
  _id: string;
  name: string;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const limit = 9;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBlogs(currentPage, activeCategory);
  }, [currentPage, activeCategory]);

  const fetchCategories = async () => {
    try {
      const response = await blogsAPI.getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBlogs = async (page: number, category: string) => {
    setIsLoading(true);
    try {
      const categoryParam = category === "All" ? undefined : category;
      const response = await blogsAPI.getAll(page, limit, categoryParam);
      setBlogs(response.data.data);
      setTotalPages(response.data.pages);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getImageUrl = (blog: Blog) => {
    if (blog.image?.data) {
      return `data:${blog.image.contentType};base64,${blog.image.data}`;
    }
    return "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600";
  };

  // Check if any blog is featured
  const featuredBlogs = blogs.filter(blog => blog.isFeatured);
  const hasFeaturedBlogs = featuredBlogs.length > 0;
  const displayBlogs = hasFeaturedBlogs && currentPage === 1
    ? blogs.filter(blog => !blog.isFeatured)
    : blogs;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] pt-28 sm:pt-32 pb-20 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Blogs"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-blue-900/90" />

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
            className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-6"
          >
            Knowledge Hub
          </motion.span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            Our Blogs & <span className="text-blue-300">Insights</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            Expert insights on Income Tax, GST, Company Law, Startups & Financial Advisory
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b sticky top-[88px] sm:top-[92px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryChange("All")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "All"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BookOpen size={16} />
              All
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.name
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog List */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Heading */}
          <ScrollAnimation>
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                Latest Articles
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Stay Informed & Updated
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
                Discover valuable insights from our expert Chartered Accountants on taxation, compliance, and business growth
              </p>
            </div>
          </ScrollAnimation>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="flex gap-4 mb-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Articles Yet</h3>
              <p className="text-gray-500">Check back soon for expert insights and updates.</p>
            </div>
          ) : (
            <>
              {/* Featured Blog Section - Only show if there are featured blogs */}
              {hasFeaturedBlogs && currentPage === 1 && (
                <ScrollAnimation>
                  <Link to={`/blogs/${featuredBlogs[0].slug}`} className="block mb-12">
                    <motion.article
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 grid md:grid-cols-2 gap-0"
                    >
                      <div className="relative h-64 md:h-auto">
                        <img
                          src={getImageUrl(featuredBlogs[0])}
                          alt={featuredBlogs[0].title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <Star size={14} fill="white" /> Featured
                          </span>
                        </div>
                      </div>
                      <div className="p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} /> {formatDate(featuredBlogs[0].createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={14} /> {featuredBlogs[0].author}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                          {featuredBlogs[0].title}
                        </h3>
                        <p className="text-gray-600 mb-6 line-clamp-3">{featuredBlogs[0].excerpt}</p>
                        <span className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
                          Read Full Article <ArrowRight size={18} />
                        </span>
                      </div>
                    </motion.article>
                  </Link>
                </ScrollAnimation>
              )}

              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {displayBlogs.map((blog, index) => (
                  <ScrollAnimation key={blog._id} delay={index * 0.05}>
                    <Link to={`/blogs/${blog.slug}`} className="block h-full">
                      <motion.article
                        whileHover={{ y: -8 }}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 h-full flex flex-col group"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={getImageUrl(blog)}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> {formatDate(blog.createdAt)}
                            </span>
                          </div>

                          <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {blog.title}
                          </h3>

                          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                            {blog.excerpt}
                          </p>

                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                            <span className="flex items-center gap-2 text-sm text-gray-500">
                              <User size={14} /> {blog.author}
                            </span>
                            <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold group-hover:gap-2 transition-all">
                              Read <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    </Link>
                  </ScrollAnimation>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12 md:mt-16 flex flex-col items-center gap-4"
                >
                  <p className="text-sm text-gray-600">
                    Showing {blogs.length} of {total} articles
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

    </>
  );
}
