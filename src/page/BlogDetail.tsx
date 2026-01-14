import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { blogsAPI } from "../services/api";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image: {
    data: string;
    contentType: string;
  };
  createdAt: string;
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slug) {
      fetchBlog(slug);
    }
  }, [slug]);

  const fetchBlog = async (blogSlug: string) => {
    try {
      const response = await blogsAPI.getBySlug(blogSlug);
      setBlog(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Blog not found");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getImageUrl = () => {
    if (blog?.image?.data) {
      return `data:${blog.image.contentType};base64,${blog.image.data}`;
    }
    return "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600";
  };

  if (isLoading) {
    return (
      <div className="pt-40 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="pt-32 sm:pt-40 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">{error || "The blog you are looking for does not exist."}</p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] sm:h-[50vh] md:h-[65vh] pt-20 sm:pt-24 flex items-center justify-center">
        <img
          src={getImageUrl()}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 max-w-4xl text-center text-white px-4"
        >
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/80 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="sm:w-3.5 sm:h-3.5" /> {formatDate(blog.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <User size={12} className="sm:w-3.5 sm:h-3.5" /> {blog.author}
            </span>
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Content Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-xl shadow-lg mb-8 sm:mb-10"
          >
            <img
              src={getImageUrl()}
              alt={blog.title}
              className="w-full h-[200px] sm:h-[300px] md:h-[420px] object-cover"
            />
          </motion.div>

          {/* Blog Text */}
          <div
            className="prose prose-sm sm:prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Back */}
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 mt-8 sm:mt-12 text-blue-600 font-semibold hover:underline text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            Back to Blogs
          </Link>
        </div>
      </section>
    </>
  );
}
