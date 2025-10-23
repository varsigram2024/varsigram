// OpportunityDetail.tsx - Updated with link field for Apply button
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";
import { Img } from "../../components/Img";
import { opportunityService, type Opportunity, categoryToTypeMap } from "../../services/opportunityService";

// SVG placeholder for image error
const placeholderSVG = `data:image/svg+xml;base64,${btoa(`
  <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">Opportunity Image</text>
  </svg>
`)}`;

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  console.log('OpportunityDetail - ID from URL:', id);


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

const shareOpportunity = (opportunity: Opportunity) => {
  const shareUrl = window.location.href;
  const shareText = `Check out this opportunity: ${opportunity.title}`;
  
  if (navigator.share) {
    navigator.share({
      title: opportunity.title,
      text: shareText,
      url: shareUrl,
    });
  } else {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this link to share:', shareUrl);
    });
  }
};

// Add inside the OpportunityDetail component, after the state declarations:
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
const menuRef = useRef<HTMLDivElement>(null);
const currentUserId = getCurrentUserId();

const isOwner = currentUserId && opportunity && (
  opportunity.userId === currentUserId || 
  opportunity.createdBy?.toString() === currentUserId
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
  if (!isOwner || !opportunity) return;

  if (!confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
    return;
  }

  setIsDeleting(true);
  try {
    await opportunityService.deleteOpportunity(opportunity.id);
    navigate('/opportunities');
  } catch (error) {
    console.error('Delete failed:', error);
    alert('Failed to delete opportunity. Please try again.');
  } finally {
    setIsDeleting(false);
  }
};

const handleShare = () => {
  if (opportunity) {
    shareOpportunity(opportunity);
  }
  setIsMenuOpen(false);
};



  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id || id === 'undefined') {
        console.error('Invalid opportunity ID:', id);
        setError('Invalid opportunity ID');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      setImageError(false);
      try {
        console.log('Fetching opportunity with ID:', id);
        const data = await opportunityService.getOpportunityById(id);
        
        if (data) {
          setOpportunity(data);
          console.log('Opportunity data:', data);
        } else {
          setError('Opportunity not found');
        }
      } catch (err) {
        console.error('Error fetching opportunity:', err);
        setError('Failed to load opportunity');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  const handleApply = () => {
    if (opportunity?.link) {
      // Open the application link in a new tab
      window.open(opportunity.link, '_blank', 'noopener,noreferrer');
    } else if (opportunity?.contactEmail) {
      // Fallback to email if no link is provided
      window.location.href = `mailto:${opportunity.contactEmail}?subject=Application for ${opportunity.title}&body=Hello, I am interested in applying for the ${opportunity.title} position.`;
    } else {
      alert(`Application process for ${opportunity?.title} would start here.`);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getDaysUntilDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    try {
      const now = new Date();
      const deadlineDate = new Date(deadline);
      const diffTime = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    return categoryToTypeMap[category as keyof typeof categoryToTypeMap] || category;
  };

  // Check if the link is a valid URL
  const isValidUrl = (url: string | null) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#750015] mx-auto"></div>
          <Text className="text-gray-500 mt-4">Loading opportunity...</Text>
        </div>
      </div>
    );
  }

  if (error && !opportunity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Text className="text-gray-500 text-4xl">⚠️</Text>
        </div>
        <Heading as="h2" className="text-lg font-semibold text-gray-700 mb-2">
          {error}
        </Heading>
        <Text className="text-gray-500 text-sm mb-4">
          {error.includes('Invalid') ? 'Please check the URL and try again.' : 'The opportunity could not be loaded.'}
        </Text>
        <div className="flex gap-2">
          <Button
            className="bg-[#750015] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5a0010]"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
            onClick={() => navigate('/opportunities')}
          >
            Browse Opportunities
          </Button>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Text className="text-gray-500 text-4xl">❓</Text>
        </div>
        <Heading as="h2" className="text-lg font-semibold text-gray-700 mb-2">
          Opportunity not found
        </Heading>
        <Text className="text-gray-500 text-sm mb-4">
          The opportunity you're looking for doesn't exist or may have been removed.
        </Text>
        <Button
          className="bg-[#750015] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5a0010]"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const daysUntilDeadline = getDaysUntilDeadline(opportunity.deadline);
  const isDeadlineApproaching = daysUntilDeadline !== null && daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  const isDeadlinePassed = daysUntilDeadline !== null && daysUntilDeadline < 0;
  const hasApplicationLink = isValidUrl(opportunity.link);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Error warning */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
            <Text className="text-yellow-800 text-sm">{error}</Text>
          </div>
        )}

                {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div className="flex-1">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to opportunities
              </button>
              <Heading as="h1" className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {opportunity.title}
              </Heading>
              <div className="flex flex-wrap items-center gap-2 text-gray-600">
                <Text className="text-lg">
                  {opportunity.organization || 'Unknown Organization'}
                </Text>
                <span>•</span>
                <Text>
                  {opportunity.location || (opportunity.isRemote ? 'Remote' : 'Location not specified')}
                </Text>
                {opportunity.isRemote && (
                  <>
                    <span>•</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Remote
                    </span>
                  </>
                )}
              </div>
            </div>
            
            {/* Three-dot menu and Apply button container */}
            <div className="flex items-center gap-2">
             
              {/* Apply Button */}
              <Button
                className="bg-[#750015] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a0010] whitespace-nowrap lg:w-auto w-full shadow-lg flex items-center justify-center gap-2"
                onClick={handleApply}
              >
                {hasApplicationLink ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Apply Now
                  </>
                ) : (
                  'Apply Now'
                )}
              </Button>


               {/* Three-dot menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            </div>
          </div>

        {/* Image */}
        <div className="w-full h-64 lg:h-80 bg-gray-100 rounded-xl overflow-hidden mb-8 shadow-sm">
          <img 
            src={opportunity.image && !imageError ? opportunity.image : placeholderSVG} 
            alt={opportunity.title} 
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {getCategoryDisplayName(opportunity.category)}
          </span>
          
          {opportunity.isRemote && (
            <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Remote
            </span>
          )}
          
          {opportunity.applicants !== undefined && opportunity.applicants > 0 && (
            <span className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              {opportunity.applicants} {opportunity.applicants === 1 ? 'applicant' : 'applicants'}
            </span>
          )}
          
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isDeadlinePassed 
              ? 'bg-red-100 text-red-800' 
              : isDeadlineApproaching 
                ? 'bg-orange-100 text-orange-800'
                : 'bg-gray-100 text-gray-800'
          }`}>
            {isDeadlinePassed ? 'Deadline passed' : `Deadline: ${formatDate(opportunity.deadline)}`}
            {isDeadlineApproaching && daysUntilDeadline && (
              <span className="ml-1">({daysUntilDeadline} {daysUntilDeadline === 1 ? 'day' : 'days'} left)</span>
            )}
          </span>

          {opportunity.postedAt && (
            <span className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              Posted {opportunity.postedAt}
            </span>
          )}
        </div>

        {/* Application Link (if available) */}
        {hasApplicationLink && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <div>
                <Text className="text-blue-800 font-medium text-sm">
                  External Application Link Available
                </Text>
                <Text className="text-blue-700 text-xs mt-1">
                  Click "Apply Now" to be redirected to the official application page
                </Text>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="mb-8">
            <Heading as="h3" className="text-xl font-semibold text-gray-900 mb-4">
              Tags
            </Heading>
            <div className="flex flex-wrap gap-2">
              {opportunity.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <Heading as="h3" className="text-xl font-semibold text-gray-900 mb-4">
            About this Opportunity
          </Heading>
          <div className="prose max-w-none">
            <Text className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
              {opportunity.description || 'No description provided.'}
            </Text>
          </div>
        </div>

        {/* Requirements */}
        {opportunity.requirements && (
          <div className="mb-8">
            <Heading as="h3" className="text-xl font-semibold text-gray-900 mb-4">
              Requirements
            </Heading>
            <div className="prose max-w-none">
              <Text className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                {opportunity.requirements}
              </Text>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="border-t border-gray-200 pt-8 mb-16">
          <Heading as="h3" className="text-xl font-semibold text-gray-900 mb-4">
            Contact Information
          </Heading>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="space-y-3">
              {hasApplicationLink && (
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <div>
                    <Text className="text-gray-700 font-medium">Application Link</Text>
                    <Text className="text-blue-600 hover:text-blue-800 cursor-pointer break-all" onClick={() => window.open(opportunity.link, '_blank')}>
                      {opportunity.link}
                    </Text>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <Text className="text-gray-700 font-medium">Email</Text>
                  <Text className="text-gray-600">
                    {opportunity.contactEmail || 'Not provided'}
                  </Text>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <Text className="text-gray-700 font-medium">Organization</Text>
                  <Text className="text-gray-600">
                    {opportunity.organization || 'Not provided'}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Button at Bottom for mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 lg:hidden shadow-lg">
          <Button
            className="bg-[#750015] text-white w-full py-3 rounded-lg font-semibold hover:bg-[#5a0010] shadow-lg flex items-center justify-center gap-2"
            onClick={handleApply}
          >
            {hasApplicationLink ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Apply Now
              </>
            ) : (
              'Apply Now'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}