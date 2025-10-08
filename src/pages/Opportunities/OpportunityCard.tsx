// OpportunityCard.tsx - Mobile-first Figma-aligned card
import { Img } from '../../components/Img'
import { Text } from '../../components/Text'
import { Button } from '../../components/Button'

type Opportunity = {
  id: string
  title: string
  organization: string
  image?: string
}

export default function OpportunityCard({ item }: { item: Opportunity }) {
  return (
    <article className="bg-white overflow-hidden mb-4 py-8">
      {/* Title Section */}
      <div className="px-4 pb-4">
        <Text className="text-lg font-semibold text-gray-900 mb-1">
          {item.title}
        </Text>
      </div>
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center gap-2">
          <Img
            src="/images/avatar-placeholder.png"
            alt={item.organization}
            className="w-8 h-8 rounded-full"
          />
          <Text className="text-sm text-gray-600 font-medium">
            {item.organization} shared this
          </Text>
        </div>
        <Button
          className="bg-[#750015] text-white text-sm px-4 py-1.5 rounded-lg font-semibold hover:bg-[#5a0010]"
          onClick={() => window.location.href = `/opportunities/${item.id}`}
        >
          Apply
        </Button>
      </div>

      {/* Image Section */}
      <div className="px-4 pb-4">
        {item.image ? (
          <Img
            src="/images/opportunity.png"
            alt={item.title}
            className="w-full h-44 object-cover rounded-xl mb-2"
          />
        ) : (
          <div className="w-full h-44 bg-gray-200 rounded-xl mb-2 flex items-center justify-center">
            <Text className="text-gray-500">No Image Available</Text>
          </div>
        )}
      </div>

      {/* Horizontal line to demarcate cards */}
      <hr className="border-t-2 border-[#B0B0B0] mx-4" />
    </article>
  )
}
