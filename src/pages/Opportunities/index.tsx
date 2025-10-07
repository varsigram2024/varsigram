// index.tsx - Simplified Opportunities Feed
import { useMemo, useState } from 'react'
import { useNavigate } from "react-router-dom";
import OpportunityCard from './OpportunityCard'
import ProfileOrganizationSection from '../Profilepage/ProfilepageOrganizationSection';
import WhoToFollowSidePanel from "../../components/whoToFollowSidePanel/index.tsx";
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
  const navigate = useNavigate();
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 6

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

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
    <div className="flex w-full bg-white min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header - Simplified */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#750015] rounded-full flex items-center justify-center">
                <Img 
                  src="/images/vectors/resources-icon.svg" 
                  alt="Opportunities" 
                  className="h-5 w-5 filter brightness-0 invert" 
                />
              </div>
              <div>
                <Heading as="h1" className="text-xl font-semibold text-gray-900">
                  Opportunities
                </Heading>
                <Text className="text-gray-600 text-sm">
                  Discover opportunities
                </Text>
              </div>
            </div>
            
            {/* Desktop Create Button */}
            <Button 
              className="hidden lg:flex bg-[#750015] text-white hover:bg-[#5a0010] px-4 py-2 rounded-lg text-sm"
              onClick={() => handleNavigation("opportunities/create")}
            >
              Create Opportunity
            </Button>

            {/* Mobile Create Button - Plus Icon */}
            <button 
              className="lg:hidden w-10 h-10 bg-[#750015] text-white rounded-full flex items-center justify-center text-xl font-bold"
              onClick={() => handleNavigation("opportunities/create")}
            >
              +
            </button>
          </div>

          {/* Search Bar - Simplified */}
          <div className="mb-6">
            <Input 
              placeholder="Search opportunities..." 
              value={query} 
              onChange={(e: any) => { setQuery(e.target.value); setPage(1)}} 
              className="rounded-lg bg-gray-50 border-0"
            />
          </div>

          

          {/* Opportunities Grid - Simplified */}
          <div className="space-y-4 mb-8">
            {pageItems.length === 0 && (
              <div className="text-center py-12">
                <Img 
                  src="/images/empty-state.svg" 
                  alt="No opportunities found" 
                  className="h-24 w-24 mx-auto mb-4 opacity-50"
                />
                <Heading as="h3" className="text-lg font-medium text-gray-600 mb-2">
                  No opportunities found
                </Heading>
                <Text className="text-gray-500 text-sm">
                  Try adjusting your search or filters
                </Text>
              </div>
            )}

            {pageItems.map(item => (
              <OpportunityCard key={item.id} item={item} />
            ))}
          </div>

          {/* Simplified Pagination */}
          <div className="flex items-center justify-between">
            <Text className="text-sm text-gray-600">
              {filtered.length} opportunities
            </Text>
            <div className="flex gap-1">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => Math.max(1, p-1))} 
                className="px-3 py-1.5 bg-white rounded border border-gray-300 disabled:opacity-50 text-sm"
              >
                Previous
              </button>
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(p => Math.min(totalPages, p+1))} 
                className="px-3 py-1.5 bg-white rounded border border-gray-300 disabled:opacity-50 text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:flex flex-col sticky top-0 max-w-[35%] gap-8 mt-[72px] mb-8 pb-20 h-[100vh] overflow-scroll scrollbar-hide animate-slide-left">
        <div className="rounded-2xl border border-gray-200 bg-white">
          <ProfileOrganizationSection />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <WhoToFollowSidePanel />
        </div>
      </div>
    </div>
  )
}