// OpportunityDetail.tsx - Fixed version
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Heading } from "../../components/Heading";
import { Text } from "../../components/Text";
import { Img } from "../../components/Img";
import { opportunityService, type Opportunity } from "../../services/opportunityService";

// Fallback data for when API fails
const FALLBACK_DATA: Opportunity[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  title: `Program ${i + 1}`,
  organization: ['Unilag', 'Varsigram', 'KPMG'][i % 3],
  location: i % 2 === 0 ? 'Lagos, NG' : 'Remote',
  category: ['INTERNSHIP', 'SCHOLARSHIP', 'OTHER'][i % 3] as 'INTERNSHIP' | 'SCHOLARSHIP' | 'OTHER',
  description: `This is a detailed description of ${['Internship', 'Scholarship', 'Others'][i % 3]} program ${i + 1}. 
  It includes eligibility requirements, benefits, how to apply, and important deadlines. 
  Ensure you read the full details carefully before submitting your application.`,
  requirements: 'Some requirements here...',
  contactEmail: 'contact@example.com',
  deadline: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i * 2) + 1).padStart(2, '0')}T23:59:59Z`,
  isRemote: i % 2 === 1,
  image: '/images/opportunity.png',
  applicants: Math.floor(Math.random() * 100) + 1,
  tags: i % 3 === 0 ? ['career', 'remote'] : ['scholarships', 'deadline']
}));

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('OpportunityDetail - ID from URL:', id); // Debug log

  useEffect(() => {
    const fetchOpportunity = async () => {
      // Check if ID is valid
      if (!id || id === 'undefined') {
        console.error('Invalid opportunity ID:', id);
        setError('Invalid opportunity ID');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching opportunity with ID:', id);
        const data = await opportunityService.getOpportunityById(id);
        
        if (data) {
          setOpportunity(data);
        } else {
          // Try fallback data
          const fallback = FALLBACK_DATA.find(o => o.id === id);
          if (fallback) {
            console.log('Using fallback data for ID:', id);
            setOpportunity(fallback);
            setError('Using demo data - API connection issue');
          } else {
            setError('Opportunity not found');
          }
        }
      } catch (err) {
        console.error('Error fetching opportunity:', err);
        // Try fallback data
        const fallback = FALLBACK_DATA.find(o => o.id === id);
        if (fallback) {
          console.log('Using fallback data after error for ID:', id);
          setOpportunity(fallback);
          setError('Using demo data - API connection issue');
        } else {
          setError('Failed to load opportunity');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  const handleApply = () => {
    if (opportunity?.contactEmail) {
      window.location.href = `mailto:${opportunity.contactEmail}?subject=Application for ${opportunity.title}&body=Hello, I am interested in applying for the ${opportunity.title} position.`;
    } else {
      alert(`Application process for ${opportunity?.title} would start here.`);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#750015] mx-auto"></div>
          <Text className="text-gray-500 mt-4">Loading opportunity...</Text>
        </div>
      </div>
    );
  }

  if (error && !opportunity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Text className="text-gray-500 text-4xl">⚠️</Text>
        </div>
        <Heading as="h2" className="text-lg font-semibold text-gray-700 mb-2">
          {error}
        </Heading>
        <Text className="text-gray-500 text-sm mb-4">
          {error.includes('Invalid') ? 'Please check the URL and try again.' : 'The opportunity could not be loaded.'}
        </Text>
        <div className="flex gap-2">
          <Button
            className="bg-[#750015] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5a0010]"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
            onClick={() => navigate('/opportunities')}
          >
            Browse Opportunities
          </Button>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Text className="text-gray-500 text-4xl">❓</Text>
        </div>
        <Heading as="h2" className="text-lg font-semibold text-gray-700 mb-2">
          Opportunity not found
        </Heading>
        <Text className="text-gray-500 text-sm mb-4">
          The opportunity you're looking for doesn't exist or may have been removed.
        </Text>
        <Button
          className="bg-[#750015] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5a0010]"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Error warning */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
            <Text className="text-yellow-800 text-sm">{error}</Text>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div className="flex-1">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 text-sm"
            >
              ← Back to opportunities
            </button>
            <Heading as="h1" className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
              {opportunity.title}
            </Heading>
            <Text className="text-gray-600 text-lg">
              {opportunity.organization} • {opportunity.location}
              {opportunity.isRemote && ' • Remote'}
            </Text>
          </div>
          <Button
            className="bg-[#750015] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a0010] whitespace-nowrap lg:w-auto w-full"
            onClick={handleApply}
          >
            Apply Now
          </Button>
        </div>

        {/* Image */}
          {opportunity.image && (
            <div className="w-full h-64 lg:h-80 bg-gray-100 rounded-xl overflow-hidden mb-8">
              <img 
                src={opportunity.image} 
                alt={opportunity.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/opportunity.png";
                }}
              />
            </div>
          )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {opportunity.category}
          </span>
          {opportunity.isRemote && (
            <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Remote
            </span>
          )}
          {opportunity.applicants && (
            <span className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              {opportunity.applicants} applicants
            </span>
          )}
          <span className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
            Deadline: {formatDate(opportunity.deadline)}
          </span>
        </div>

        {/* Description */}
        <div className="mb-8">
          <Heading as="h3" className="text-xl font-semibold text-gray-900 mb-4">
            About this Opportunity
          </Heading>
          <div className="prose max-w-none">
            <Text className="text-gray-700 leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </Text>
          </div>
        </div>

        {/* Requirements */}
        {opportunity.requirements && (
          <div className="mb-8">
            <Heading as="h3" className="text-xl font-semibold text-gray-900 mb-4">
              Requirements
            </Heading>
            <div className="prose max-w-none">
              <Text className="text-gray-700 leading-relaxed whitespace-pre-line">
                {opportunity.requirements}
              </Text>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="border-t pt-8">
          <Heading as="h3" className="text-xl font-semibold text-gray-900 mb-4">
            Contact Information
          </Heading>
          <div className="bg-gray-50 rounded-lg p-4">
            <Text className="text-gray-700">
              <strong>Email:</strong> {opportunity.contactEmail}
            </Text>
            <Text className="text-gray-700 mt-2">
              <strong>Organization:</strong> {opportunity.organization}
            </Text>
          </div>
        </div>

        {/* Apply Button at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-4 px-4 lg:hidden">
          <Button
            className="bg-[#750015] text-white w-full py-3 rounded-lg font-semibold hover:bg-[#5a0010]"
            onClick={handleApply}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}