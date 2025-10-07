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
}

export default function OpportunityCard({ item }: { item: Opportunity }) {
  return (
    <article className="bg-white rounded-lg shadow-md border p-4 flex flex-col md:flex-row gap-4 hover:shadow-lg transition-shadow">
      <div className="flex-shrink-0 w-full md:w-44 h-28 bg-gray-50 rounded overflow-hidden">
        <Img src="/images/cover-photo-bg.svg" alt="org" className="h-full w-full object-cover" />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
            <Text className="text-sm text-gray-500 truncate">{item.organization} • {item.location || 'Remote'}</Text>
          </div>
          <div className="text-right flex-shrink-0">
            <Text className="text-xs text-gray-400">{item.postedAt}</Text>
          </div>
        </div>

        <p className="mt-3 text-gray-700 text-sm line-clamp-3">{item.excerpt}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {(item.tags || []).slice(0,3).map(t => (
              <span key={t} className="text-xs bg-[#f1f1f1] text-[#3a3a3a] px-2 py-1 rounded-full border">{t}</span>
            ))}
          </div>
          <div>
            <Button onClick={() => alert('Open opportunity ' + item.id)} className="px-3 py-1 bg-[#750015] text-white hover:brightness-110">View</Button>
          </div>
        </div>
      </div>
    </article>
  )
}
