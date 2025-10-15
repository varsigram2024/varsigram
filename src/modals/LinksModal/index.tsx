import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, ExternalLink } from 'lucide-react';

interface SocialLinks {
  linkedin: string;
  twitter: string;
  whatsapp: string;
  email: string;
  instagram: string;
  portfolio: string;
}

interface LinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  token: string;
  fetchUserData: () => Promise<void>;
  accountType: 'student' | 'organization';
}

const LinksModal: React.FC<LinksModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  token,
  fetchUserData,
  accountType
}) => {
  const [userLinks, setUserLinks] = useState<SocialLinks>({
    linkedin: '',
    twitter: '',
    whatsapp: '',
    email: '',
    instagram: '',
    portfolio: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with existing links when modal opens
  useEffect(() => {
    if (isOpen && userProfile?.social_links) {
      setUserLinks(userProfile.social_links);
    } else if (isOpen) {
      // Reset form when opening
      setUserLinks({
        linkedin: '',
        twitter: '',
        whatsapp: '',
        email: '',
        instagram: '',
        portfolio: ''
      });
    }
  }, [isOpen, userProfile?.social_links]);

  const handleSaveLinks = async () => {
    if (!token) {
      alert('Please log in to save links');
      return;
    }

    setIsLoading(true);
    try {
      const payload = { 
        user: { 
          social_links: userLinks 
        } 
      };

      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
      
      await axios.patch(
        `${API_BASE_URL}/${accountType}/update/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      await fetchUserData();
      onClose();
      // Show success message (you can use toast here)
      alert('Links saved successfully!');
    } catch (err: any) {
      console.error('Error saving links:', err);
      alert('Failed to save links. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (platform: keyof SocialLinks, value: string) => {
    setUserLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const formatUrl = (url: string, platform: keyof SocialLinks): string => {
    if (!url) return '';
    
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Format based on platform
    switch (platform) {
      case 'linkedin':
        return `https://linkedin.com/in/${url.replace(/^@/, '')}`;
      case 'twitter':
        return `https://twitter.com/${url.replace(/^@/, '')}`;
      case 'instagram':
        return `https://instagram.com/${url.replace(/^@/, '')}`;
      case 'portfolio':
        return `https://${url}`;
      case 'email':
        return url; // email doesn't need URL formatting
      case 'whatsapp':
        return url; // phone number doesn't need URL formatting
      default:
        return url;
    }
  };

  const getPlaceholder = (platform: keyof SocialLinks): string => {
    switch (platform) {
      case 'linkedin':
        return 'yourprofile or https://linkedin.com/in/yourprofile';
      case 'twitter':
        return 'yourprofile or https://twitter.com/yourprofile';
      case 'instagram':
        return 'yourprofile or https://instagram.com/yourprofile';
      case 'whatsapp':
        return '+1234567890';
      case 'email':
        return 'your.email@example.com';
      case 'portfolio':
        return 'yourportfolio.com or https://yourportfolio.com';
      default:
        return '';
    }
  };

  const getPlatformName = (platform: keyof SocialLinks): string => {
    switch (platform) {
      case 'linkedin': return 'LinkedIn';
      case 'twitter': return 'Twitter';
      case 'whatsapp': return 'WhatsApp';
      case 'email': return 'Email';
      case 'instagram': return 'Instagram';
      case 'portfolio': return 'Portfolio Website';
      default: return platform;
    }
  };

  const getPlatformIcon = (platform: keyof SocialLinks) => {
    // You can replace these with actual SVG icons or images
    const icons = {
      linkedin: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      twitter: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      whatsapp: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.444"/>
        </svg>
      ),
      email: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      instagram: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      portfolio: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
        </svg>
      )
    };
    
    return icons[platform];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex flex-col w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Manage Your Links</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <p className="text-gray-600 mb-6">
              Add your social media profiles and contact information. These will be displayed on your profile.
            </p>
            
            {(['linkedin', 'twitter', 'whatsapp', 'email', 'instagram', 'portfolio'] as const).map((platform) => (
              <div key={platform} className="flex flex-col gap-3">
                <label className="flex items-center gap-3 text-lg font-semibold text-gray-800">
                  <div className="text-[#750015]">
                    {getPlatformIcon(platform)}
                  </div>
                  {getPlatformName(platform)}
                </label>
                
                <div className="flex gap-2">
                  <input
                    type={platform === 'email' ? 'email' : platform === 'whatsapp' ? 'tel' : 'text'}
                    placeholder={getPlaceholder(platform)}
                    value={userLinks[platform]}
                    onChange={(e) => handleInputChange(platform, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#750015] focus:border-transparent transition-colors"
                  />
                  
                  {userLinks[platform] && (
                    <a
                      href={
                        platform === 'email' 
                          ? `mailto:${userLinks[platform]}`
                          : platform === 'whatsapp'
                          ? `https://wa.me/${userLinks[platform].replace(/[^\d+]/g, '')}`
                          : formatUrl(userLinks[platform], platform)
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <ExternalLink size={16} />
                      Test
                    </a>
                  )}
                </div>
                
                {platform === 'whatsapp' && userLinks.whatsapp && (
                  <p className="text-sm text-gray-500">
                    Format: Include country code (e.g., +1234567890)
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveLinks}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-[#750015] text-white rounded-lg hover:bg-[#a0001f] disabled:opacity-50 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Plus size={20} />
                Save Links
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinksModal;