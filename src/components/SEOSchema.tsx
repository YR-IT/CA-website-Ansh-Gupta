import { useSiteInfo } from "../context/SiteContext";

export default function SEOSchema() {
  const { siteInfo } = useSiteInfo();

  const cleanPhone = siteInfo.phone.replace(/\D/g, '');
  const phoneNumber = cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "A S Gupta & Co - Chartered Accountants",
    "alternateName": "CA Anshul Gupta",
    "url": "https://www.caanshulgupta.com",
    "logo": "https://www.caanshulgupta.com/logo.png",
    "image": "https://www.caanshulgupta.com/logo.png",
    "description": "Professional Chartered Accountancy firm providing Income Tax, GST, Audit, Company Registration, Startup Services, and Business Advisory services across India. Expert CA services for ITR Filing, GST Registration, Tax Planning, and Financial Compliance.",
    "telephone": `+${phoneNumber}`,
    "email": siteInfo.email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "India",
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "priceRange": "$$",
    "openingHours": siteInfo.workingHours || "Mo-Sa 09:00-18:00",
    "sameAs": [
      `https://wa.me/${phoneNumber}`
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": `+${phoneNumber}`,
      "contactType": "Customer Support",
      "email": siteInfo.email,
      "availableLanguage": ["English", "Hindi"]
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "CA Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Income Tax Return Filing",
            "description": "Expert ITR filing services for individuals and businesses"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "GST Registration & Filing",
            "description": "Complete GST registration, return filing, and compliance services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Company Registration",
            "description": "Private Limited, LLP, OPC, and Partnership firm registration"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Audit & Accounting",
            "description": "Statutory audit, tax audit, and accounting services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Startup Services",
            "description": "Startup India registration, funding assistance, and compliance"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Business Advisory",
            "description": "Strategic business consulting and financial planning"
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
