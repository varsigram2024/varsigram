// index.tsx – Opportunities Page with Tab Navigation and Click-to-Detail
import { useMemo, useState } from 'react'
import { useNavigate } from "react-router-dom"
import OpportunityCard from './OpportunityCard'
import { Heading } from '../../components/Heading'
import WhoToFollowSidePanel from '../../components/whoToFollowSidePanel'
import { Text } from '../../components/Text'
import { Img } from '../../components/Img'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import ProfileOrganizationSection from '../Profilepage/ProfilepageOrganizationSection'

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
  image?: string
}

const MOCK: Opportunity[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  title: `Program ${i + 1}`,
  organization: ['Unilag', 'Varsigram', 'KPMG'][i % 3],
  location: i % 2 === 0 ? 'Lagos, NG' : 'Remote',
  type: ['Internships', 'Scholarships', 'Others'][i % 3],
  tags: i % 3 === 0 ? ['career', 'remote'] : ['scholarships', 'deadline'],
  postedAt: `${i + 1}d ago`,
  applicants: Math.floor(Math.random() * 100) + 1,
  deadline: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i * 2) + 1).padStart(2, '0')}`,
  excerpt: 'Brief description of this opportunity and how to apply.',
  image: '/images/opportunity.png'
}))

export default function Opportunities() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'Internships' | 'Scholarships' | 'Others'>('Internships')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MOCK.filter(m => {
      const matchesType = m.type?.toLowerCase() === activeTab.toLowerCase()
      const matchesQ = q === '' ||
        m.title.toLowerCase().includes(q) ||
        m.organization.toLowerCase().includes(q)
      return matchesType && matchesQ
    })
  }, [query, activeTab])

  return (
    <div className="flex w-full bg-white min-h-screen space-x-4">
      <div className="flex-1 p-4 lg:p-6 items-start justify-center relative border-x border-solid">
        <div className="max-w-6xl mx-auto flex-1 w-full">
         
          {/* Sticky Tabs Container */}
          <div className="sticky top-16 bg-white z-10 pt-2 pb-2">
            {/* Tabs */}
            <div className="flex items-center self-stretch justify-between gap-4 border-b border-gray-200 mb-6 bg-white">
              {['Internships', 'Scholarships', 'Others'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-3 text-sm font-medium transition-all relative ${
                    activeTab === tab
                      ? 'text-[#750015] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#750015]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {filtered.length === 0 ? (
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
                Try a different tab or search term
              </Text>
            </div>
          ) : (
            <div className="space-y-2 lg:px-16">
              {filtered.map(item => (
                <div
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/opportunities/${item.id}`)}
                >
                  <OpportunityCard item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Create Button at the bottom (sticky for all screens) */}
        <div className="flex items-center gap-4 mt-0 lg:mt-0 w-full justify-end p-8 sticky bottom-11 z-20 ">
          <button
            className="w-12 h-12 bg-[#750015] text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
            onClick={() => navigate("/opportunities/create")}
            aria-label="Create Opportunity"
          >
            +
          </button>
        </div>
      </div>

      <div className="hidden lg:flex flex-col sticky top-0 max-w-[35%] gap-8 mt-[72px] mb-8 pb-20 h-[100vh] overflow-scroll scrollbar-hide animate-slide-left">
        <div className="rounded-[32px] border border-solid h-auto max-h-[60vh] border-[#d9d9d9] bg-white px-[22px] py-5 animate-fade-in">
          <div className="overflow-hidden h-full">
            <WhoToFollowSidePanel />
          </div>
        </div>
        <div className="rounded-[32px] border border-solid border-[#d9d9d9] bg-white animate-fade-in">
          <ProfileOrganizationSection />
        </div>
      </div>
    </div>
  )
}