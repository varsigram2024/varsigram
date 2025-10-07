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
    <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
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
                            src={item.image}
                            alt={item.title}
                            className="w-full h-44 object-cover rounded-xl mb-2"
                        />
                    ) : (
                        <svg width="352" height="352" viewBox="0 0 352 352" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <rect x="-22" width="383" height="478" fill="url(#pattern0_2740_11331)"/>
                            <defs>
                                <pattern id="pattern0_2740_11331" patternContentUnits="objectBoundingBox" width="1" height="1">
                                    <use xlinkHref="#image0_2740_11331" transform="matrix(0.00115741 0 0 0.000927379 0 -0.000784519)"/>
                                </pattern>
                                <image id="image0_2740_11331" width="864" height="1080" preserveAspectRatio="none" xlinkHref="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."/>
                            </defs>
                        </svg>
                    )}

      </div>

     
    </article>
  )
}
