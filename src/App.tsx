import { Routes, Route, useLocation } from "react-router-dom";

// Public Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import { SiteProvider } from "./context/SiteContext";

// Public Pages
import Home from "./page/Home";
import About from "./page/AboutUs";
import Services from "./page/Service";
import ServiceDetail from "./page/ServiceDetail";
import SubServiceDetail from "./page/SubServiceDetail";
import BlogsPage from "./page/BlogsPage";
import BlogDetail from "./page/BlogDetail";
import Contact from "./page/Contact";
import Faq from "./page/Faq";

// Admin Components
import { AuthProvider } from "./admin/context/AuthContext";
import ProtectedRoute from "./admin/components/ProtectedRoute";

// Admin Pages
import AdminLogin from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import AdminServices from "./admin/pages/Services";
import ServiceForm from "./admin/pages/ServiceForm";
import AdminBlogs from "./admin/pages/Blogs";
import BlogForm from "./admin/pages/BlogForm";
import AdminContacts from "./admin/pages/Contacts";
import AdminFAQs from "./admin/pages/FAQs";
import FAQForm from "./admin/pages/FAQForm";
import AdminAboutUs from "./admin/pages/AboutUsPage";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Show Header and Footer only for public routes */}
      {!isAdminRoute && <Header />}
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/services/:serviceSlug/:subServiceSlug" element={<SubServiceDetail />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <AdminServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services/new"
          element={
            <ProtectedRoute>
              <ServiceForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services/:id/edit"
          element={
            <ProtectedRoute>
              <ServiceForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <ProtectedRoute>
              <AdminBlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs/new"
          element={
            <ProtectedRoute>
              <BlogForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs/:id/edit"
          element={
            <ProtectedRoute>
              <BlogForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <ProtectedRoute>
              <AdminContacts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/faqs"
          element={
            <ProtectedRoute>
              <AdminFAQs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/faqs/new"
          element={
            <ProtectedRoute>
              <FAQForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/faqs/:id/edit"
          element={
            <ProtectedRoute>
              <FAQForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/aboutus"
          element={
            <ProtectedRoute>
              <AdminAboutUs />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <AppContent />
      </SiteProvider>
    </AuthProvider>
  );
}
