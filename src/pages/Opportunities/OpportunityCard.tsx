// Updated OpportunityCard.tsx
import { useState, useRef, useEffect } from 'react';
import { opportunityService, type Opportunity, categoryToTypeMap } from '../../services/opportunityService';
import { Img } from '../../components/Img';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';

// SVG placeholder for image error
const placeholderSVG = `data:image/svg+xml;base64,${btoa(`
  <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">Opportunity Image</text>
  </svg>
`)}`;

interface OpportunityCardProps {
  item: Opportunity;
  onDelete?: (id: string) => void;
}

// Helper functions
const getCurrentUserId = (): string | null => {
  const tokenSources = [
    localStorage.getItem('auth_token'),
    localStorage.getItem('token'),
    localStorage.getItem('jwtToken'),
    localStorage.getItem('access_token'),
  ];
  
  const token = tokenSources.find(t => t && t !== 'null' && t !== 'undefined');
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.userId || payload.sub || payload.id || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
  return null;
};

const shareOpportunity = async (opportunity: Opportunity) => {
  const shareUrl = `${window.location.origin}/opportunities/${opportunity.id}`;
  const shareText = `Check out this opportunity: ${opportunity.title}`;
  
  try {
    if (navigator.share) {
      await navigator.share({
        title: opportunity.title,
        text: shareText,
        url: shareUrl,
      });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } else {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    }
  } catch (error) {
    console.error('Error sharing:', error);
    // Don't show alert if user cancels share
    if (error instanceof Error && !error.name.includes('AbortError')) {
      alert('Failed to share opportunity. Please try again.');
    }
  }
};

// Apply button functionality from OpportunityDetail
const handleApply = (opportunity: Opportunity) => {
  if (opportunity?.link) {
    window.open(opportunity.link, '_blank', 'noopener,noreferrer');
  } else if (opportunity?.contactEmail) {
    window.location.href = `mailto:${opportunity.contactEmail}?subject=Application for ${opportunity.title}&body=Hello, I am interested in applying for the ${opportunity.title} position.`;
  } else {
    alert(`Application process for ${opportunity?.title} would start here.`);
  }
};

// Check if URL is valid
const isValidUrl = (url: string | null) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Format deadline for display
const formatDeadline = (deadline: string | null) => {
  if (!deadline) return 'No deadline';
  try {
    return new Date(deadline).toLocaleDateString();
  } catch {
    return 'Invalid date';
  }
};

export default function OpportunityCard({ item, onDelete }: OpportunityCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const currentUserId = getCurrentUserId();
  
  // Check if current user is the owner - FIXED comparison
  const isOwner = currentUserId && item && (
    item.userId === currentUserId || 
    item.createdBy?.toString() === currentUserId ||
    (item.createdBy && item.createdBy.toString() === currentUserId)
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isOwner) {
      alert('You can only delete opportunities you created');
      return;
    }

    if (!item?.id) {
      alert('Invalid opportunity data');
      return;
    }

    if (!confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await opportunityService.deleteOpportunity(item.id);
      onDelete?.(item.id);
      setIsMenuOpen(false);
    } catch (error: any) {
      console.error('Delete failed:', error);
      alert(error.message || 'Failed to delete opportunity. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await shareOpportunity(item);
    setIsMenuOpen(false);
  };

  // Prevent card click when interacting with menu or buttons
  const handleCardClick = (e: React.MouseEvent) => {
    // If click originated from menu or buttons, don't navigate
    if (
      menuRef.current?.contains(e.target as Node) ||
      menuButtonRef.current?.contains(e.target as Node)
    ) {
      return;
    }
    
    // Navigate to opportunity detail
    if (item?.id) {
      window.location.href = `/opportunities/${item.id}`;
    }
  };

  // Map backend category to frontend display type
  const displayType = categoryToTypeMap[item.category] || 'Opportunity';
  
  // Handle null location
  const displayLocation = item.location || (item.isRemote ? 'Remote' : '');

  // Handle null organization
  const displayOrganization = item.organization || '';

  // Use backend excerpt or generate one
  const displayExcerpt = item.excerpt || (item.description ? `${item.description.substring(0, 100)}...` : '');

  // Handle image with fallback
  const imageUrl = item.image || "/images/opportunity.png";

  // Check if application link is available
  const hasApplicationLink = isValidUrl(item.link);

  return (
    <article className="bg-white overflow-hidden mb-4 py-8 relative border-b border-gray-200">
      {/* Three-dot menu */}
        <div className="absolute top-6 right-6">
        <button
          ref={menuButtonRef}
          onClick={handleMenuToggle}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 relative z-10"
          aria-label="More options"
        >
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {isMenuOpen && (
          <div 
            ref={menuRef}
            className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
          >
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <div className='flex justify-between items-start px-6 pb-4'>
        {/* Title Section */}
        <div className="flex-1">
          <Text className="text-lg max-w-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {item.title}
          </Text>
          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {displayType}
            </span>
            {item.isRemote && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Remote
              </span>
            )}
            <span className="text-gray-600">{displayLocation}</span>
          </div>
        </div>
      </div>
      
      {/* Organization */}
      <div className="flex items-center gap-3 px-6 pb-4">
        <Text className="text-sm text-gray-600 font-medium">
          {displayOrganization}
        </Text>
      </div>

      <div className="flex items-start justify-between pr-6 pb-4">
        {/* Description Excerpt */}
        {displayExcerpt && (
          <div className="px-6 pb-4 flex-1">
            <Text className="text-sm text-gray-600 leading-relaxed">
              {displayExcerpt}
            </Text>
          </div>
        )}

        {/* Apply Button */}
        <div className="ml-4 flex-shrink-0">
          <Button
            className="bg-[#750015] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#5a0010] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#750015] focus:ring-opacity-50"
            onClick={() => handleApply(item)}
          >
            {hasApplicationLink ? (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Apply
              </span>
            ) : (
              'Apply'
            )}
          </Button>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* Image Section */}
      <div className="px-6 pb-4">
        <div className="relative w-full h-44 bg-gray-100 rounded-xl overflow-hidden">
          <Img
            src={imageError ? placeholderSVG : imageUrl}
            alt={item.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#750015]"></div>
            </div>
          )}
        </div>
      </div>

      {/* Tags (if available) */}
      {item.tags && item.tags.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">
                +{item.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Meta Information */}
      <div className="px-6 flex justify-between items-center text-sm text-gray-500">
        <span className="font-medium">{item.postedAt}</span>
        <span className="bg-gray-100 px-3 py-1 rounded-full">
          Deadline: {formatDeadline(item.deadline)}
        </span>
      </div>
    </article>
  );
}