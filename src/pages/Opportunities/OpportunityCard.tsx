// Add these imports at the top
import { useState, useRef, useEffect } from 'react';
import { opportunityService } from '../../services/opportunityService';


const placeholderSVG = `data:image/svg+xml;base64,${btoa(`
  <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">Opportunity Image</text>
  </svg>
`)}`;

// Add this interface if not already present
interface OpportunityCardProps {
  item: any;
  onDelete?: (id: string) => void;
}

// Add these helper functions near the top of the file
const getCurrentUserId = (): string | null => {
  // Try to get user ID from various possible token sources
  const tokenSources = [
    localStorage.getItem('auth_token'),
    localStorage.getItem('token'),
    localStorage.getItem('jwtToken'),
    localStorage.getItem('access_token'),
  ];
  
  const token = tokenSources.find(t => t && t !== 'null' && t !== 'undefined');
  
  if (token) {
    try {
      // Decode JWT token to get user ID
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.userId || payload.sub || payload.id || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
  return null;
};

const shareOpportunity = (opportunity: any) => {
  const shareUrl = `${window.location.origin}/opportunities/${opportunity.id}`;
  const shareText = `Check out this opportunity: ${opportunity.title}`;
  
  if (navigator.share) {
    // Use Web Share API if available
    navigator.share({
      title: opportunity.title,
      text: shareText,
      url: shareUrl,
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      // Final fallback: show URL in prompt
      prompt('Copy this link to share:', shareUrl);
    });
  }
};

// Update the OpportunityCard component to include the three-dot menu
export default function OpportunityCard({ item, onDelete }: OpportunityCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentUserId = getCurrentUserId();
  
  // Check if current user is the owner
  const isOwner = currentUserId && (
    item.userId === currentUserId || 
    item.createdBy?.toString() === currentUserId
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!isOwner) {
      alert('You can only delete opportunities you created');
      return;
    }

    if (!confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      // You'll need to add a delete method to your opportunityService
      await opportunityService.deleteOpportunity(item.id);
      onDelete?.(item.id);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete opportunity. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    shareOpportunity(item);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Three-dot menu button */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="More options"
        >
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <button
              onClick={handleShare}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            
            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Rest of your existing OpportunityCard content remains the same */}
      <div className="flex items-start space-x-4">
        <img 
          src={item.image || placeholderSVG} 
          alt={item.title}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{item.organization}</p>
          <div className="flex items-center mt-2 space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {item.category}
            </span>
            {item.isRemote && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Remote
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.excerpt}</p>
        </div>
      </div>
    </div>
  );
}