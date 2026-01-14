# A S GUPTA AND CO - Frontend

React/TypeScript frontend application for the A S GUPTA AND CO Chartered Accountants website.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Routes](#routes)
- [Components](#components)
- [Pages](#pages)
- [API Integration](#api-integration)
- [Admin Panel](#admin-panel)
- [Styling](#styling)
- [Scripts](#scripts)
- [File Descriptions](#file-descriptions)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.7.2 | Type Safety |
| Vite | 6.0.1 | Build Tool & Dev Server |
| Tailwind CSS | 3.4.15 | Utility-First CSS |
| Framer Motion | 11.12.0 | Animations |
| React Router | 7.0.2 | Client-Side Routing |
| Axios | 1.7.8 | HTTP Client |
| React Quill | 2.0.0 | Rich Text Editor |
| Lucide React | 0.460.0 | Icon Library |

---

## Project Structure

```
frontend/
├── public/                       # Static assets
│   ├── logo.jpg                  # Company logo
│   ├── about.jpg                 # About page image
│   ├── services-hero.jpeg        # Services hero image
│   └── ...                       # Other images
│
├── src/
│   ├── admin/                    # Admin panel module
│   │   ├── components/
│   │   │   ├── AdminLayout.tsx   # Admin sidebar & header layout
│   │   │   ├── ProtectedRoute.tsx # Auth guard for admin routes
│   │   │   └── RichTextEditor.tsx # Quill editor wrapper
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Authentication state management
│   │   └── pages/
│   │       ├── Login.tsx         # Admin login page
│   │       ├── Dashboard.tsx     # Dashboard with statistics
│   │       ├── Services.tsx      # Services list management
│   │       ├── ServiceForm.tsx   # Create/Edit service form
│   │       ├── Blogs.tsx         # Blogs list management
│   │       ├── BlogForm.tsx      # Create/Edit blog form
│   │       └── Contacts.tsx      # Contact submissions viewer
│   │
│   ├── components/               # Shared public components
│   │   ├── Header.tsx            # Navigation header
│   │   ├── Footer.tsx            # Site footer
│   │   ├── HeroSlider.tsx        # Homepage hero carousel
│   │   ├── BlogSection.tsx       # Blog cards section
│   │   ├── MissionSection.tsx    # Mission/values section
│   │   ├── ScrollAnimattion.tsx  # Scroll reveal animation wrapper
│   │   └── ScrollToTop.tsx       # Scroll to top on route change
│   │
│   ├── page/                     # Public page components
│   │   ├── Home.tsx              # Homepage
│   │   ├── AboutUs.tsx           # About page
│   │   ├── Service.tsx           # Services listing
│   │   ├── ServiceDetail.tsx     # Service detail with sub-services
│   │   ├── BlogsPage.tsx         # Blogs listing
│   │   ├── BlogDetail.tsx        # Single blog post
│   │   ├── Contact.tsx           # Contact form
│   │   └── FAQ.tsx               # FAQ page
│   │
│   ├── services/
│   │   └── api.ts                # Axios API client & endpoints
│   │
│   ├── data/
│   │   └── blogExplain.ts        # Static blog category data
│   │
│   ├── App.tsx                   # Main app with routing
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Global styles & Tailwind imports
│   └── vite-env.d.ts             # Vite type definitions
│
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
├── tsconfig.json                 # TypeScript base config
├── tsconfig.app.json             # App TypeScript config
├── tsconfig.node.json            # Node TypeScript config
├── eslint.config.js              # ESLint configuration
├── vite.config.ts                # Vite configuration
├── .env                          # Environment variables (DO NOT COMMIT)
├── .env.example                  # Environment template
└── README.md                     # This file
```

---

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Environment Variables

Create a `.env` file:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Production example:
# VITE_API_URL=https://api.yourdomain.com/api
```

**Note:** All Vite environment variables must be prefixed with `VITE_` to be exposed to the client.

---

## Routes

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Homepage with hero, services, about |
| `/about` | AboutUs | Company information, team, mission |
| `/services` | Service | Services listing grid |
| `/services/:slug` | ServiceDetail | Service detail with sub-services & modal |
| `/blogs` | BlogsPage | Blog posts listing |
| `/blogs/:slug` | BlogDetail | Single blog post |
| `/faq` | FAQ | Frequently asked questions |
| `/contact` | Contact | Contact form |

### Admin Routes (Protected)

| Path | Component | Description |
|------|-----------|-------------|
| `/admin/login` | Login | Admin authentication |
| `/admin/dashboard` | Dashboard | Statistics & overview |
| `/admin/services` | Services | Services list with CRUD |
| `/admin/services/new` | ServiceForm | Create new service |
| `/admin/services/:id/edit` | ServiceForm | Edit existing service |
| `/admin/blogs` | Blogs | Blogs list with CRUD |
| `/admin/blogs/new` | BlogForm | Create new blog |
| `/admin/blogs/:id/edit` | BlogForm | Edit existing blog |
| `/admin/contacts` | Contacts | Contact submissions |

---

## Components

### Public Components

#### `Header.tsx`
- Responsive navigation bar
- Mobile hamburger menu
- Sticky on scroll with background change
- Contact info bar at top

#### `Footer.tsx`
- Company information
- Quick links navigation
- Featured services (4 items)
- Contact information
- Social links

#### `HeroSlider.tsx`
- Auto-playing image carousel
- Navigation dots
- Animated text overlays
- Call-to-action buttons

#### `ScrollAnimattion.tsx`
- Framer Motion wrapper
- Fade-in-up animation on scroll
- Configurable delay

#### `ScrollToTop.tsx`
- Scrolls to top on route change

### Admin Components

#### `AdminLayout.tsx`
- Sidebar navigation (desktop always visible)
- Mobile slide-out menu
- Top header with user dropdown
- Active route highlighting

#### `ProtectedRoute.tsx`
- Auth guard HOC
- Redirects to login if not authenticated
- Verifies token on mount

#### `RichTextEditor.tsx`
- React Quill wrapper
- Toolbar: headings, bold, italic, lists, links
- HTML output

---

## Pages

### Home Page (`Home.tsx`)
- Hero slider with CTA
- About section with trust badges
- Services grid (8 services, clickable)
- Why choose us section
- Call to action

### Service Detail (`ServiceDetail.tsx`)
- Hero banner with service title
- **With sub-services:** Shows content + clickable sub-service list
- **Without sub-services:** Shows main content directly
- Sub-service modal popup
- Contact sidebar
- CTA section

### Blog Detail (`BlogDetail.tsx`)
- Featured image
- Category badge
- Author & date
- HTML content rendering
- View count
- Related posts (optional)

### Contact (`Contact.tsx`)
- Contact form with validation
- Name, email, phone, subject, message
- Success/error notifications
- Company contact information
- Google Maps embed (optional)

### Admin Dashboard (`Dashboard.tsx`)
- Statistics cards (services, blogs, contacts, unread)
- Recent contacts list
- Recent blogs list
- Quick action buttons

### Admin ServiceForm (`ServiceForm.tsx`)
- Service details: title, short description, icon, order
- Rich text editor for content
- Image upload with preview
- Sub-services management:
  - Add/remove sub-services
  - Reorder with up/down buttons
  - Expandable panels
  - Each with title, description, content
- Active/inactive toggle

---

## API Integration

### API Client (`services/api.ts`)

```typescript
// Base configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Interceptors
- Request: Adds Bearer token from localStorage
- Response: Handles 401 by redirecting to login
```

### Available APIs

```typescript
// Authentication
authAPI.login(email, password)
authAPI.verify()
authAPI.changePassword(currentPassword, newPassword)

// Public Services
servicesAPI.getAll()
servicesAPI.getBySlug(slug)

// Public Blogs
blogsAPI.getAll()
blogsAPI.getBySlug(slug)

// Public Contact
contactAPI.submit({ name, email, phone?, subject, message })

// Admin Operations
adminAPI.getStats()
adminAPI.getServices()
adminAPI.getService(id)
adminAPI.createService(formData)
adminAPI.updateService(id, formData)
adminAPI.deleteService(id)
adminAPI.getBlogs()
adminAPI.getBlog(id)
adminAPI.createBlog(formData)
adminAPI.updateBlog(id, formData)
adminAPI.deleteBlog(id)
adminAPI.getContacts()
adminAPI.markContactRead(id)
adminAPI.deleteContact(id)
```

---

## Admin Panel

### Authentication Flow
1. User visits `/admin/login`
2. Submits email & password
3. Backend returns JWT token
4. Token stored in `localStorage.adminToken`
5. AuthContext updates `isAuthenticated`
6. Redirected to `/admin/dashboard`

### AuthContext
```typescript
interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

### Protected Routes
All admin routes wrapped with `<ProtectedRoute>`:
- Checks `isAuthenticated` from context
- Shows loading spinner while verifying
- Redirects to `/admin/login` if not authenticated

---

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom configuration in `tailwind.config.js`
- Responsive breakpoints: sm, md, lg, xl, 2xl

### Color Scheme
```css
Primary: blue-600, blue-900 (headers, buttons)
Secondary: gray-50, gray-100 (backgrounds)
Text: gray-900 (headings), gray-600 (body)
Accent: white (contrast)
```

### Framer Motion Animations
- Page transitions
- Scroll reveal animations
- Hover effects on cards
- Modal open/close
- Menu slide animations

---

## Scripts

```bash
# Development
npm run dev              # Start Vite dev server (port 5173)

# Production Build
npm run build            # TypeScript compile + Vite build

# Preview
npm run preview          # Preview production build locally

# Linting
npm run lint             # Run ESLint

# Type Checking
npm run typecheck        # TypeScript type check (no emit)
```

---

## File Descriptions

### `/src/App.tsx`
Main application component. Defines all routes using React Router. Conditionally shows Header/Footer for non-admin routes.

### `/src/main.tsx`
React entry point. Wraps App with BrowserRouter.

### `/src/index.css`
Global styles and Tailwind CSS imports (`@tailwind base/components/utilities`).

### `/src/services/api.ts`
Axios instance with base URL configuration. Includes request interceptor for auth token and response interceptor for 401 handling.

### `/src/admin/context/AuthContext.tsx`
React Context for authentication state. Handles login, logout, token verification, and provides auth state to all admin components.

### `/src/admin/components/AdminLayout.tsx`
Layout wrapper for admin pages. Contains:
- Sidebar with navigation links
- Top header with user info
- Mobile responsive menu
- Logout functionality

### `/src/admin/components/ProtectedRoute.tsx`
HOC that protects admin routes. Verifies authentication and redirects unauthorized users.

### `/src/admin/pages/ServiceForm.tsx`
Complex form for creating/editing services. Features:
- Dynamic sub-services array
- Rich text editors
- Image upload handling
- Form validation

### `/src/page/ServiceDetail.tsx`
Service detail page with:
- Hero section
- Conditional rendering based on sub-services
- Modal popup for sub-service details
- Escape key and click-outside to close modal

### `/src/components/Header.tsx`
Responsive navigation with:
- Desktop horizontal menu
- Mobile hamburger menu
- Sticky behavior with scroll detection
- Contact bar

### `/src/components/Footer.tsx`
Site footer with:
- Company info
- Quick links
- Featured services (limited to 4)
- Contact details

### `/vite.config.ts`
Vite configuration:
- React plugin
- Lucide React optimization (include in optimizeDeps)
- Manual chunks for code splitting

### `/tailwind.config.js`
Tailwind configuration:
- Content paths for purging
- Theme extensions
- Plugin configurations

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Performance Optimizations

1. **Code Splitting**: Manual chunks for lucide-react
2. **Lazy Loading**: Images load on scroll
3. **Tree Shaking**: Unused code removed in production
4. **Minification**: JavaScript and CSS minified
5. **Gzip**: Enable on server for further compression

---

## Deployment

### Vercel/Netlify

1. Push code to GitHub
2. Import project
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL`
6. Deploy

### Environment Variables for Production

```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## Troubleshooting

### ERR_BLOCKED_BY_CLIENT
- Ad blocker blocking requests
- Whitelist localhost in ad blocker

### API Connection Failed
- Verify backend is running
- Check VITE_API_URL is correct
- Check CORS configuration on backend

### Admin Login Fails
- Verify credentials
- Check if admin exists in database
- Run `npm run setup:admin` in backend

### Images Not Loading
- Check image paths in public folder
- Verify image URLs from API

---

## License

Private - A S GUPTA AND CO
#   C A - w e b s i t e - A n s h - G u p t a  
 