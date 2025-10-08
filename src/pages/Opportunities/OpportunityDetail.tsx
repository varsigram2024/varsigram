// OpportunityDetail.tsx – Detailed Opportunity View Page
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../../components/Button"
import { Heading } from "../../components/Heading"
import { Text } from "../../components/Text"
import { Img } from "../../components/Img"

// Temporary mock data — replace with API or global state later
const MOCK = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  title: `Program ${i + 1}`,
  organization: ['Unilag', 'Varsigram', 'KPMG'][i % 3],
  location: i % 2 === 0 ? 'Lagos, NG' : 'Remote',
  type: ['Internship', 'Scholarship', 'Others'][i % 3],
  image: "/images/opportunity.png",
  applicants: Math.floor(Math.random() * 100) + 1,
  deadline: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i * 2) + 1).padStart(2, '0')}`,
  description: `This is a detailed description of ${['Internship', 'Scholarship', 'Others'][i % 3]} program ${i + 1}. 
  It includes eligibility requirements, benefits, how to apply, and important deadlines. 
  Ensure you read the full details carefully before submitting your application.`
}))

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const opportunity = MOCK.find(o => o.id === id)

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <Img src="/images/empty-state.svg" alt="Not found" className="h-24 w-24 mb-4 opacity-60" />
        <Heading as="h2" className="text-lg font-semibold text-gray-700 mb-2">
          Opportunity not found
        </Heading>
        <Button
          className="bg-[#750015] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5a0010]"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white flex flex-col lg:flex-row min-h-screen">
      {/* Header Image */}
      <div className="w-full h-auto bg-gray-100 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Heading as="h1" className="text-2xl font-semibold text-gray-900 mb-1">
              {opportunity.title}
            </Heading>
            <Text className="text-gray-600 text-sm">
              {opportunity.organization} — {opportunity.location}
            </Text>
          </div>
          <Button
            className="bg-[#750015] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#5a0010]"
            onClick={() => alert(`Applying for ${opportunity.title}`)}
          >
            Apply Now
          </Button>
        </div>
        <Img 
          src={opportunity.image} 
          alt={opportunity.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-6">
        

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-6">
          <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            {opportunity.type}
          </span>
          <span>Applicants: {opportunity.applicants}</span>
          <span>Deadline: {opportunity.deadline}</span>
        </div>

        {/* Description */}
        <Text className="text-gray-700 leading-relaxed whitespace-pre-line">
          {opportunity.description}
        </Text>
      </div>
    </div>
  )
}
