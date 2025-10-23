// modals/LinksModal/index.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, ExternalLink, Trash2 } from 'lucide-react'; // Added Trash2 icon
import { toast } from 'react-hot-toast';

interface SocialLinksData {
  linkedin_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  website_url: string | null;
  whatsapp_url: string | null;
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
  const [userLinks, setUserLinks] = useState<SocialLinksData>({
    linkedin_url: null,
    twitter_url: null,
    instagram_url: null,
    website_url: null,
    whatsapp_url: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with existing links when modal opens
  useEffect(() => {
    if (isOpen) {
      setUserLinks({
        linkedin_url: userProfile?.user?.linkedin_url || null,
        twitter_url: userProfile?.user?.twitter_url || null,
        instagram_url: userProfile?.user?.instagram_url || null,
        website_url: userProfile?.user?.website_url || null,
        whatsapp_url: userProfile?.user?.whatsapp_url || null,
      });
    }
  }, [isOpen, userProfile]);

  const handleSaveLinks = async () => {
    if (!token) {
      toast.error('Please log in to save links');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for API - convert empty strings to null
      const payload: Record<string, string> = {};

      Object.entries(userLinks).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          if (key === "website_url") {
            payload["portfolio_url"] = value.trim();
          } else {
            payload[key] = value.trim();
          }
        }
      });

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      
      await axios.patch(`${API_BASE_URL}/profile/social-links/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await fetchUserData();
      onClose();
      toast.success('Links saved successfully!');
    } catch (err: any) {
      console.error('Error saving links:', err);
      if (err.response?.data) {
        const errorMessages = Object.values(err.response.data).flat().join(', ');
        toast.error(`Failed to save links: ${errorMessages}`);
      } else {
        toast.error('Failed to save links. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (platform: keyof SocialLinksData, value: string) => {
    setUserLinks(prev => ({
      ...prev,
      [platform]: value || null
    }));
  };

  // NEW: Function to remove a specific link
  const handleRemoveLink = (platform: keyof SocialLinksData) => {
    setUserLinks(prev => ({
      ...prev,
      [platform]: null
    }));
  };

  // NEW: Function to check if a link has content
  const hasLinkContent = (platform: keyof SocialLinksData): boolean => {
    return !!userLinks[platform] && userLinks[platform]!.trim() !== '';
  };

  const formatUrl = (url: string | null, platform: keyof SocialLinksData): string => {
    if (!url) return '';
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    switch (platform) {
      case 'linkedin_url':
        return `https://linkedin.com/in/${url.replace(/^@/, '')}`;
      case 'twitter_url':
        return `https://x.com/${url.replace(/^@/, '')}`;
      case 'instagram_url':
        return `https://instagram.com/${url.replace(/^@/, '')}`;
      case 'website_url':
        return `https://${url}`;
      default:
        return url;
    }
  };

  const getPlaceholder = (platform: keyof SocialLinksData): string => {
    switch (platform) {
      case 'whatsapp_url':
        return 'https://wa.me/234XXXXXXXXXX';
      case 'linkedin_url':
        return 'https://linkedin.com/in/yourprofile';
      case 'twitter_url':
        return 'https://x.com/yourprofile';
      case 'instagram_url':
        return 'https://instagram.com/yourprofile';
      case 'website_url':
        return 'https://yourportfolio.com';
      default:
        return '';
    }
  };

  const getPlatformName = (platform: keyof SocialLinksData): string => {
    switch (platform) {
      case 'linkedin_url': return 'LinkedIn';
      case 'twitter_url': return 'X';
      case 'instagram_url': return 'Instagram';
      case 'website_url': return 'Portfolio/Website';
      case 'whatsapp_url': return 'WhatsApp';
      default: return platform;
    }
  };

  const getPlatformIcon = (platform: keyof SocialLinksData) => {
    const icons = {
      linkedin_url: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      twitter_url: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      whatsapp_url: (
        <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
          <path d="M16.001 3C9.384 3 4 8.383 4 15c0 2.552.77 4.937 2.102 6.916L4 29l7.301-2.063A11.949 11.949 0 0 0 16 27c6.617 0 12-5.383 12-12S22.618 3 16.001 3zM16 25a9.012 9.012 0 0 1-4.605-1.27l-.33-.196-4.334 1.226 1.234-4.223-.211-.338A9.014 9.014 0 0 1 7 15c0-4.963 4.037-9 9-9s9 4.037 9 9-4.037 9-9 9zm4.992-6.623c-.273-.136-1.615-.797-1.865-.885-.25-.091-.432-.136-.613.136-.182.273-.704.885-.863 1.067-.159.182-.318.205-.591.068-.273-.136-1.154-.426-2.197-1.36-.812-.724-1.36-1.616-1.519-1.89-.159-.273-.017-.42.12-.556.124-.123.273-.319.41-.478.137-.159.182-.273.273-.455.091-.182.046-.341-.023-.478-.068-.136-.613-1.477-.84-2.023-.223-.537-.45-.464-.613-.472l-.523-.009c-.182 0-.478.068-.728.341-.25.273-.955.933-.955 2.272s.978 2.637 1.114 2.818c.136.182 1.924 2.941 4.66 4.127.652.282 1.162.45 1.559.576.655.208 1.25.179 1.719.109.524-.078 1.615-.659 1.843-1.296.227-.637.227-1.183.159-1.296-.068-.114-.25-.182-.523-.318z"/>
        </svg>
      ),
      instagram_url: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      website_url: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      )
    };
    
    return icons[platform];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex flex-col w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl overflow-hidden">
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
            
            {(['linkedin_url', 'twitter_url', 'instagram_url', 'website_url', 'whatsapp_url'] as const).map((platform) => (
              <div key={platform} className="flex flex-col gap-3">
                <label className="flex items-center gap-3 text-lg font-semibold text-gray-800">
                  {/* <div className="text-[#750015]">
                    {getPlatformIcon(platform)}
                  </div> */}
                  {getPlatformName(platform)}
                </label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={getPlaceholder(platform)}
                    value={userLinks[platform] || ''}
                    onChange={(e) => handleInputChange(platform, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#750015] focus:border-transparent transition-colors"
                  />
                  
                  {/* Action buttons container */}
                  <div className="flex gap-2">
                    {/* Test Link Button - only show if there's content */}
                    {hasLinkContent(platform) && (
                      <a
                        href={formatUrl(userLinks[platform], platform)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        <ExternalLink size={16} />
                        Test
                      </a>
                    )}
                    
                    {/* Remove Button - only show if there's content to remove */}
                    {hasLinkContent(platform) && (
                      <button
                        onClick={() => handleRemoveLink(platform)}
                        className="flex items-center gap-2 px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                        title={`Remove ${getPlatformName(platform)} link`}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
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