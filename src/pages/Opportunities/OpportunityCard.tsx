// OpportunityCard.tsx - Updated Card Component
import { Img } from '../../components/Img'
import { Text } from '../../components/Text'
import { Button } from '../../components/Button'

type Opportunity = {
  id: string
  title: string
  organization: string
  location?: string
  type?: string
  tags?: string[]
  postedAt?: string
  excerpt?: string
  applicants?: number
  deadline?: string
}

export default function OpportunityCard({ item }: { item: Opportunity }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
      {/* Header with type and bookmark */}
      <div className="flex justify-between items-start p-6 pb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#f8f0f0] text-[#750015]">
          {item.type}
        </span>
        <button className="text-gray-400 hover:text-[#750015] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 pt-0">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Img 
              src="/images/cover-photo-bg.svg" 
              alt={item.organization}
              className="h-6 w-6 text-gray-400" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-[#750015] transition-colors">
              {item.title}
            </h3>
            <Text className="text-sm text-gray-600 truncate">
              {item.organization}
            </Text>
          </div>
        </div>

        <p className="text-gray-700 text-sm line-clamp-2 mb-4">
          {item.excerpt}
        </p>

        {/* Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {item.location}
          </div>
          
          {item.applicants && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              {item.applicants} applicants
            </div>
          )}

          {item.deadline && (
            <div className="flex items-center text-sm text-red-600 font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Deadline: {formatDate(item.deadline)}
            </div>
          )}
        </div>

        {/* Tags and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {(item.tags || []).slice(0, 2).map(t => (
              <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {t}
              </span>
            ))}
            {(item.tags || []).length > 2 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{(item.tags || []).length - 2}
              </span>
            )}
          </div>
          <Button 
            onClick={() => window.location.href = `/opportunities/${item.id}`}
            className="px-4 py-2 bg-[#750015] text-white hover:bg-[#5a0010] rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </Button>
        </div>
      </div>
    </article>
  )
}