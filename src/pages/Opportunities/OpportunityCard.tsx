// OpportunityCard.tsx - Update Apply button to use link
import { Img } from '../../components/Img'
import { Text } from '../../components/Text'
import { Button } from '../../components/Button'
import { Opportunity, categoryToTypeMap } from '../../services/opportunityService'

// SVG placeholder
const placeholderSVG = `data:image/svg+xml;base64,${btoa(`
  <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">Opportunity Image</text>
  </svg>
`)}`;

export default function OpportunityCard({ item }: { item: Opportunity }) {
  // Map backend category to frontend display type
  const displayType = categoryToTypeMap[item.category] || 'Opportunity';
  
  // Format deadline for display - handle null
  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'No deadline';
    try {
      return new Date(deadline).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  // Handle null location
  const displayLocation = item.location || (item.isRemote ? 'Remote' : 'Location not specified');

  // Handle null organization
  const displayOrganization = item.organization || 'Unknown Organization';

  // Use backend excerpt or generate one
  const displayExcerpt = item.excerpt || (item.description ? `${item.description.substring(0, 100)}...` : '');

  // Handle image with better fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = placeholderSVG;
  };

  // Handle apply click
  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to detail page
    
    if (item.link) {
      // Open link in new tab
      window.open(item.link, '_blank', 'noopener,noreferrer');
    } else {
      // Navigate to detail page
      window.location.href = `/opportunities/${item.id}`;
    }
  };

  return (
    <article className="bg-white overflow-hidden mb-4 py-8">
      {/* Title Section */}
      <div className="px-4 pb-4">
        <Text className="text-lg font-semibold text-gray-900 mb-1">
          {item.title}
        </Text>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
            {displayType}
          </span>
          {item.isRemote && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              Remote
            </span>
          )}
          <span>{displayLocation}</span>
        </div>
      </div>
      
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center gap-2">
          <Img
            src="/images/avatar-placeholder.png"
            alt={displayOrganization}
            className="w-8 h-8 rounded-full"
            onError={handleImageError}
          />
          <Text className="text-sm text-gray-600 font-medium">
            {displayOrganization} shared this
          </Text>
        </div>
        <Button
          className="bg-[#750015] text-white text-sm px-4 py-1.5 rounded-lg font-semibold hover:bg-[#5a0010] flex items-center gap-1"
          onClick={handleApplyClick}
        >
          {item.link && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          )}
          Apply
        </Button>
      </div>

      {/* Description Excerpt */}
      {displayExcerpt && (
        <div className="px-4 pb-4">
          <Text className="text-sm text-gray-600">
            {displayExcerpt}
          </Text>
        </div>
      )}

      {/* Image Section */}
      <div className="px-4 pb-4">
        <Img
          src={item.image || placeholderSVG}
          alt={item.title}
          className="w-full h-44 object-cover rounded-xl mb-2"
          onError={handleImageError}
        />
      </div>

      {/* Tags (if available) */}
      {item.tags && item.tags.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                +{item.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Meta Information */}
      <div className="px-4 pb-4 flex justify-between text-sm text-gray-500">
        <span>{item.postedAt}</span>
        <span>Deadline: {formatDeadline(item.deadline)}</span>
      </div>

      {/* Horizontal line to demarcate cards */}
      <hr className="border-t-2 border-[#B0B0B0] mx-4" />
    </article>
  );
}