import { useMemo, useState } from 'react'
import OpportunityCard from './OpportunityCard'
import { Heading } from '../../components/Heading'
import { Text } from '../../components/Text'
import { Img } from '../../components/Img'
import { Input } from '../../components/Input'

type Opportunity = {
  id: string
  title: string
  organization: string
  location?: string
  tags?: string[]
  postedAt?: string
  excerpt?: string
}

const MOCK: Opportunity[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  title: `Research Internship ${i + 1}`,
  organization: ['Unilag', 'Varsigram', 'OpenAI'][i % 3],
  location: i % 2 === 0 ? 'Lagos, NG' : 'Remote',
  tags: i % 3 === 0 ? ['internship', 'research'] : ['scholarship', 'deadline'],
  postedAt: `${i + 1}d ago`,
  excerpt: 'A short summary of this opportunity and the eligibility criteria. Apply with your CV and cover letter.'
}))

export default function Opportunities() {
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 6

  const tags = useMemo(() => {
    const s = new Set<string>()
    MOCK.forEach(m => m.tags?.forEach(t => s.add(t)))
    return Array.from(s)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MOCK.filter(m => {
      const matchesQ = q === '' || m.title.toLowerCase().includes(q) || m.organization.toLowerCase().includes(q)
      const matchesTag = !selectedTag || (m.tags || []).includes(selectedTag)
      return matchesQ && matchesTag
    })
  }, [query, selectedTag])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="flex w-full items-start justify-center bg-[#f4f6f8] min-h-screen relative">
      <div className="flex flex-row-reverse w-full lg:w-[calc(100%-270px)] min-h-screen p-8">
        <div className="w-full max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center bg-white rounded-full p-2 shadow-xs">
              <Img src="/images/vectors/resources-icon.svg" alt="Opportunities" className="h-10 w-10" />
            </div>
            <Heading as="h1" className="text-2xl font-bold">Opportunities</Heading>
          </div>

          <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <Input placeholder="Search opportunities or organizations" value={query} onChange={(e:any)=>{ setQuery(e.target.value); setPage(1)}} className="rounded-lg" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={()=>{ setSelectedTag(null); setPage(1)}} className={`px-3 py-1 rounded-full border ${selectedTag===null? 'bg-[#750015] text-white border-transparent' : 'bg-white text-gray-700'}`}>All</button>
              {tags.map(t => (
                <button key={t} onClick={()=>{ setSelectedTag(t); setPage(1)}} className={`px-3 py-1 rounded-full border ${selectedTag===t? 'bg-[#750015] text-white border-transparent' : 'bg-white text-gray-700'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {pageItems.length === 0 && (
              <div className="p-6 bg-white rounded-lg text-center text-gray-600">No opportunities found.</div>
            )}

            {pageItems.map(item => (
              <div key={item.id} className="bg-transparent">
                <OpportunityCard item={item} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Text className="text-sm text-gray-600">Showing {filtered.length === 0 ? 0 : ((page-1)*perPage)+1} - {filtered.length === 0 ? 0 : Math.min(page*perPage, filtered.length)} of {filtered.length}</Text>
            <div className="flex gap-2">
              <button disabled={page===1} onClick={()=> setPage(p => Math.max(1,p-1))} className="px-3 py-1 bg-white rounded border">Prev</button>
              <div className="px-3 py-1 bg-white rounded border flex items-center gap-2">
                <button onClick={()=> setPage(1)} className="text-sm text-gray-600">{page}</button>
                <span className="text-xs text-gray-400">/ {totalPages}</span>
              </div>
              <button disabled={page===totalPages} onClick={()=> setPage(p => Math.min(totalPages,p+1))} className="px-3 py-1 bg-white rounded border">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
