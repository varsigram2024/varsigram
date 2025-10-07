// index.tsx - Updated Opportunities Feed
import { useMemo, useState } from 'react'
import OpportunityCard from './OpportunityCard'
import { Heading } from '../../components/Heading'
import { Text } from '../../components/Text'
import { Img } from '../../components/Img'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'

type Opportunity = {
  id: string
  title: string
  organization: string
  location?: string
  tags?: string[]
  postedAt?: string
  excerpt?: string
  type?: string
  applicants?: number
  deadline?: string
}

const MOCK: Opportunity[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  title: `Research Internship ${i + 1}`,
  organization: ['Unilag', 'Varsigram', 'OpenAI'][i % 3],
  location: i % 2 === 0 ? 'Lagos, NG' : 'Remote',
  type: ['Internship', 'Scholarship', 'Volunteer'][i % 3],
  tags: i % 3 === 0 ? ['internship', 'research'] : ['scholarship', 'deadline'],
  postedAt: `${i + 1}d ago`,
  applicants: Math.floor(Math.random() * 100) + 1,
  deadline: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i * 2) + 1).padStart(2, '0')}`,
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
      const matchesQ = q === '' || 
        m.title.toLowerCase().includes(q) || 
        m.organization.toLowerCase().includes(q) ||
        m.type?.toLowerCase().includes(q)
      const matchesTag = !selectedTag || (m.tags || []).includes(selectedTag)
      return matchesQ && matchesTag
    })
  }, [query, selectedTag])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="flex w-full items-start justify-center bg-white min-h-screen relative">
      <div className="flex w-full min-h-screen">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 p-6">
          <div className="space-y-6">
            <div>
              <Heading as="h3" className="text-lg font-semibold mb-4">Filters</Heading>
              
              <div className="space-y-3">
                <div>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Opportunity Type</Text>
                  <div className="space-y-2">
                    {['Internship', 'Scholarship', 'Volunteer', 'Job'].map(type => (
                      <label key={type} className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-[#750015] focus:ring-[#750015]" />
                        <Text className="text-sm text-gray-600 ml-2">{type}</Text>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Text className="text-sm font-medium text-gray-700 mb-2">Location</Text>
                  <div className="space-y-2">
                    {['Remote', 'Lagos', 'Abuja', 'International'].map(location => (
                      <label key={location} className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-[#750015] focus:ring-[#750015]" />
                        <Text className="text-sm text-gray-600 ml-2">{location}</Text>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="flex items-center gap-4 mb-4 lg:mb-0">
                <div className="flex items-center justify-center bg-[#750015] rounded-full p-3">
                  <Img 
                    src="/images/vectors/resources-icon.svg" 
                    alt="Opportunities" 
                    className="h-6 w-6 filter brightness-0 invert" 
                  />
                </div>
                <div>
                  <Heading as="h1" className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Opportunities
                  </Heading>
                  <Text className="text-gray-600">
                    Discover research opportunities, scholarships, and internships
                  </Text>
                </div>
              </div>
              
              <Button 
                className="bg-[#750015] text-white hover:bg-[#5a0010] px-6 py-3 rounded-lg font-medium"
                onClick={() => window.location.href = '/opportunities/create'}
              >
                Create Opportunity
              </Button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Input 
                    placeholder="Search opportunities, organizations, or keywords..." 
                    value={query} 
                    onChange={(e: any) => { setQuery(e.target.value); setPage(1)}} 
                    className="rounded-lg bg-white border-gray-300"
                  />
                </div>
                <div className="flex gap-2">
                  <select className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700">
                    <option>Sort by: Newest</option>
                    <option>Sort by: Deadline</option>
                    <option>Sort by: Popular</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => { setSelectedTag(null); setPage(1)}} 
                  className={`px-4 py-2 rounded-full border ${
                    selectedTag === null 
                      ? 'bg-[#750015] text-white border-transparent' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  All Opportunities
                </button>
                {tags.map(t => (
                  <button 
                    key={t} 
                    onClick={() => { setSelectedTag(t); setPage(1)}} 
                    className={`px-4 py-2 rounded-full border ${
                      selectedTag === t 
                        ? 'bg-[#750015] text-white border-transparent' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {pageItems.length === 0 && (
                <div className="col-span-full p-12 bg-gray-50 rounded-2xl text-center">
                  <Img 
                    src="/images/empty-state.svg" 
                    alt="No opportunities found" 
                    className="h-32 w-32 mx-auto mb-4 opacity-50"
                  />
                  <Heading as="h3" className="text-xl font-semibold text-gray-600 mb-2">
                    No opportunities found
                  </Heading>
                  <Text className="text-gray-500">
                    Try adjusting your search or filters to find what you're looking for.
                  </Text>
                </div>
              )}

              {pageItems.map(item => (
                <div key={item.id} className="bg-transparent">
                  <OpportunityCard item={item} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Text className="text-sm text-gray-600">
                Showing {filtered.length === 0 ? 0 : ((page-1)*perPage)+1} - {filtered.length === 0 ? 0 : Math.min(page*perPage, filtered.length)} of {filtered.length} opportunities
              </Text>
              <div className="flex gap-2">
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(p => Math.max(1, p-1))} 
                  className="px-4 py-2 bg-white rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg ${
                          page === pageNum
                            ? 'bg-[#750015] text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <Text className="text-gray-500">... of {totalPages}</Text>
                  )}
                </div>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => Math.min(totalPages, p+1))} 
                  className="px-4 py-2 bg-white rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}