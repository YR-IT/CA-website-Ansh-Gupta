import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { aboutUsAPI } from '../services/api';

interface SiteInfo {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  companyName: string;
}

interface SiteContextType {
  siteInfo: SiteInfo;
  loading: boolean;
}

const defaultSiteInfo: SiteInfo = {
  phone: '+919034059226',
  email: 'info@caanshulgupta.com',
  address: '',
  workingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
  companyName: 'A S Gupta & Co'
};

const SiteContext = createContext<SiteContextType>({
  siteInfo: defaultSiteInfo,
  loading: true
});

export function SiteProvider({ children }: { children: ReactNode }) {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(defaultSiteInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const response = await aboutUsAPI.get();
        const data = response.data.data;

        if (data) {
          setSiteInfo({
            phone: data.phone || defaultSiteInfo.phone,
            email: data.email || defaultSiteInfo.email,
            address: data.address || defaultSiteInfo.address,
            workingHours: data.workingHours || defaultSiteInfo.workingHours,
            companyName: defaultSiteInfo.companyName
          });
        }
      } catch (error) {
        console.error('Error fetching site info:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchSiteInfo();
  }, []);

  return (
    <SiteContext.Provider value={{ siteInfo, loading }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteInfo() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteInfo must be used within a SiteProvider');
  }
  return context;
}

// Helper function to format phone for tel: link
export function getPhoneLink(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `tel:+${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}`;
}

// Helper function to format phone for WhatsApp link
export function getWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const phoneNumber = cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone;
  const baseUrl = `https://wa.me/${phoneNumber}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}

// Helper function for mailto link
export function getEmailLink(email: string, subject?: string): string {
  const baseUrl = `mailto:${email}`;
  return subject ? `${baseUrl}?subject=${encodeURIComponent(subject)}` : baseUrl;
}

export default SiteContext;
