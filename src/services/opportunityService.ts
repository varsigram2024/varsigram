// services/opportunityService.ts - Fixed with no duplicates
const API_BASE_URL = import.meta.env.VITE_OPPORTUNITIES_API_BASE_URL || 'https://staging.opportunities.varsigram.com/api/v1';

// Log the configuration
console.log('🚀 Using API_BASE_URL:', API_BASE_URL);

// SVG placeholder for images
const placeholderSVG = `data:image/svg+xml;base64,${btoa(`
  <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">Opportunity Image</text>
  </svg>
`)}`;

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: 'INTERNSHIP' | 'SCHOLARSHIP' | 'COMPETITION' | 'GIG' | 'PITCH' | 'OTHER';
  location: string | null;
  isRemote: boolean;
  deadline: string | null;
  contactEmail: string | null;
  organization: string | null;
  image: string | null;
  applicants: number;
  excerpt: string | null;
  requirements: string | null;
  tags: string[] | null;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  postedAt?: string;
}

const getAuthToken = (): string | null => {
  const tokenSources = [
    localStorage.getItem('auth_token'),
    localStorage.getItem('token'),
    localStorage.getItem('jwtToken'),
    localStorage.getItem('access_token'),
  ];
  
  const token = tokenSources.find(t => t && t !== 'null' && t !== 'undefined');
  
  if (token) {
    console.log('Auth token found');
    return token;
  }
  
  console.warn('No authentication token found');
  return null;
};

// SINGLE categoryToTypeMap export - COMPETITION, GIG, PITCH go under "Others"
export const categoryToTypeMap = {
  'INTERNSHIP': 'Internship',
  'SCHOLARSHIP': 'Scholarship',
  'COMPETITION': 'Others',
  'GIG': 'Others',
  'PITCH': 'Others',
  'OTHER': 'Others'
} as const;

const transformOpportunity = (data: any): Opportunity => {
  const excerpt = data.excerpt || (data.description ? `${data.description.substring(0, 100)}${data.description.length > 100 ? '...' : ''}` : 'No description available');

  let postedAt = 'Recently';
  if (data.createdAt) {
    const daysAgo = Math.floor((Date.now() - new Date(data.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    postedAt = daysAgo === 0 ? 'Today' : `${daysAgo}d ago`;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    isRemote: data.isRemote,
    deadline: data.deadline,
    contactEmail: data.contactEmail,
    organization: data.organization,
    image: data.image,
    applicants: data.applicants || 0,
    excerpt: excerpt,
    requirements: data.requirements,
    tags: data.tags || [],
    createdBy: data.createdBy,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    userId: data.userId || data.createdBy?.toString(),
    postedAt: postedAt,
  };
};

export const opportunityService = {
  async createOpportunity(data: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Opportunity> {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please log in first.');
      }
      
      console.log('Using token for opportunity creation');
      console.log('API_BASE_URL:', API_BASE_URL);
      
      const response = await fetch(`${API_BASE_URL}/opportunities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const responseData = await response.json();
      const opportunityData = responseData.data || responseData;
      return transformOpportunity(opportunityData);
    } catch (error) {
      console.error('Create opportunity failed:', error);
      throw error;
    }
  },

  async getOpportunities(category?: string): Promise<Opportunity[]> {
    try {
      const endpoint = `${API_BASE_URL}/opportunities`;
      console.log('Fetching opportunities from:', endpoint);
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      let opportunitiesArray = [];
      if (data && typeof data === 'object') {
        if (Array.isArray(data.data)) {
          opportunitiesArray = data.data;
        } else if (Array.isArray(data)) {
          opportunitiesArray = data;
        }
      }
      
      // Client-side category filtering - COMPETITION, GIG, PITCH go under "Others"
      if (category) {
        const categoryMap: { [key: string]: string[] } = {
          'Internships': ['INTERNSHIP'],
          'Scholarships': ['SCHOLARSHIP'],
          'Others': ['COMPETITION', 'GIG', 'PITCH', 'OTHER'] // All these go under "Others"
        };
        
        const backendCategories = categoryMap[category];
        if (backendCategories) {
          opportunitiesArray = opportunitiesArray.filter((opp: any) => 
            backendCategories.includes(opp.category)
          );
        }
      }
      
      console.log(`Transforming ${opportunitiesArray.length} opportunities for tab: ${category}`);
      return opportunitiesArray.map(transformOpportunity);
    } catch (error) {
      console.error('Get opportunities failed:', error);
      return [];
    }
  },

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/opportunities/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return transformOpportunity(data);
    } catch (error) {
      console.error('Get opportunity by ID failed:', error);
      return null;
    }
  },

  async searchOpportunities(query: string): Promise<Opportunity[]> {
    try {
      const allOpportunities = await this.getOpportunities();
      const filtered = allOpportunities.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.organization?.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      return filtered;
    } catch (error) {
      console.error('Search opportunities failed:', error);
      return [];
    }
  }
};