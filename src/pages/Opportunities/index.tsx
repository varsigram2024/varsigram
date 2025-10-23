// index.tsx - Remove fallback data and use proper empty states
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import OpportunityCard from './OpportunityCard';
import { Heading } from '../../components/Heading';
import WhoToFollowSidePanel from '../../components/whoToFollowSidePanel';
import { Text } from '../../components/Text';
import { Img } from '../../components/Img';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import ProfileOrganizationSection from '../Profilepage/ProfilepageOrganizationSection';
import { opportunityService, type Opportunity } from '../../services/opportunityService';

export default function Opportunities() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Internships' | 'Scholarships' | 'Others'>('Internships');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch opportunities based on active tab
  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching opportunities for tab:', activeTab);
        const data = await opportunityService.getOpportunities(activeTab);
        setOpportunities(data);
      } catch (err) {
        console.error('Error in fetch:', err);
        setError('Failed to load opportunities from server');
        setOpportunities([]); // Set empty array instead of fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, [activeTab]);

  // Client-side filtered data
  const displayData = useMemo(() => {
    if (!query.trim()) return opportunities;
    
    const q = query.trim().toLowerCase();
    
    return opportunities.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.organization?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.tags?.some(tag => tag.toLowerCase().includes(q))
    );
  }, [opportunities, query]);

  // Handle delete opportunity
  const handleDeleteOpportunity = (deletedId: string) => {
    setOpportunities(prev => prev.filter(opp => opp.id !== deletedId));
  };

  // Get empty state message based on context
  const getEmptyMessage = () => {
    if (query.trim()) {
      return {
        title: 'No opportunities found',
        description: 'Try a different search term or browse all opportunities'
      };
    }
    
    const messages = {
      'Internships': {
        title: 'No internships available',
        description: 'Check back later for new internship opportunities'
      },
      'Scholarships': {
        title: 'No scholarships available', 
        description: 'Check back later for new scholarship opportunities'
      },
      'Others': {
        title: 'No other opportunities available',
        description: 'Check back later for new competitions, gigs, or other opportunities'
      }
    };
    
    return messages[activeTab] || {
      title: 'No opportunities available',
      description: 'Check back later for new opportunities'
    };
  };

  return (
    <div className="flex w-full bg-white min-h-screen space-x-4">
      <div className="flex-1 p-4 lg:p-6 items-start justify-center relative border-x border-solid">
        <div className="max-w-6xl mx-auto flex-1 w-full">
         
          {/* Sticky Tabs Container */}
          <div className="sticky top-16 bg-white z-10 pt-2 pb-2">
            {/* Error message - only show real errors */}
            {error && opportunities.length === 0 && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded text-sm">
                <Text className="text-red-700">{error}</Text>
              </div>
            )}
            
            {/* Search Input */}
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search opportunities..."
                value={query}
                onChange={(e: any) => setQuery(e.target.value)}
                className="w-full rounded-lg border-gray-300"
              />
            </div>

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
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#750015] mx-auto"></div>
              <Text className="text-gray-500 mt-4">Loading opportunities...</Text>
            </div>
          ) : displayData.length === 0 ? (
            <div className="text-center py-12">
              <Img 
                src="/images/empty-state.svg" 
                alt="No opportunities found" 
                className="h-24 w-24 mx-auto mb-4 opacity-50"
              />
              <Heading as="h3" className="text-lg font-medium text-gray-600 mb-2">
                {getEmptyMessage().title}
              </Heading>
              <Text className="text-gray-500 text-sm">
                {getEmptyMessage().description}
              </Text>
              {query.trim() && (
                <Button
                  onClick={() => setQuery('')}
                  className="mt-4 bg-[#750015] text-white"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2 lg:px-16">
              {displayData.map(item => (
                <div
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/opportunities/${item.id}`)}
                >
                  <OpportunityCard item={item} onDelete={handleDeleteOpportunity} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Button */}
        <div className="flex items-center gap-4 mt-0 lg:mt-0 w-full justify-end sticky bottom-11 z-20">
          <button
            className="w-12 h-12 bg-[#750015] text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg hover:bg-[#5a0010] transition-colors"
            onClick={() => navigate("/opportunities/create")}
            aria-label="Create Opportunity"
          >
            +
          </button>
        </div>
      </div>

      {/* Sidebar */}
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
  );
}