// services/opportunityService.ts
const API_BASE_URL = import.meta.env.VITE_OPPORTUNITIES_API_BASE_URL;

// services/opportunityService.ts - Ensure image field is properly typed
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
  image: string | null; // This should already be there
  applicants: number;
  excerpt: string | null;
  requirements: string | null;
  tags: string[] | null;
  // Backend auto-generated fields
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  // Frontend computed fields
  postedAt?: string;
}


// Add this function to get the token
const getAuthToken = (): string | null => {
  // Use the same key as your AuthContext
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    console.log('Found auth_token in localStorage');
    return token;
  }
  
  console.warn('No authentication token found in auth_token');
  
  // Fallback to check other possible locations (remove in production)
  const fallbackKeys = [
    'token',
    'jwtToken',
    'access_token',
    'accessToken',
    'userToken'
  ];
  
  for (const key of fallbackKeys) {
    const fallbackToken = localStorage.getItem(key);
    if (fallbackToken) {
      console.log(`Found token in fallback location: ${key}`);
      return fallbackToken;
    }
  }
  
  return null;
};




// Map backend category to frontend type
// services/opportunityService.ts - Update category mapping
export const categoryToTypeMap = {
  'INTERNSHIP': 'Internship',
  'SCHOLARSHIP': 'Scholarship',
  'COMPETITION': 'Others',
  'GIG': 'Others', 
  'PITCH': 'Others',
  'OTHER': 'Others'
} as const;

// services/opportunityService.ts - Better transform for create response
const transformOpportunity = (data: any): Opportunity => {
  console.log('Transforming opportunity data:', data);
  
  // Use backend excerpt if available, else generate from description
  const excerpt = data.excerpt || (data.description ? `${data.description.substring(0, 100)}${data.description.length > 100 ? '...' : ''}` : 'No description available');

  // Calculate postedAt from createdAt
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
    // Backend auto fields
    createdBy: data.createdBy,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    userId: data.userId || data.createdBy?.toString(),
    // Frontend computed field
    postedAt: postedAt,
  };
};

export const opportunityService = {
  // services/opportunityService.ts - Fix createOpportunity response
async createOpportunity(data: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Opportunity> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required. Please log in first.');
    }
    
    console.log('Using token for opportunity creation:', token.substring(0, 20) + '...');
    
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
    console.log('Create opportunity response:', responseData);
    
    // IMPORTANT: Check if the response is the direct object or wrapped in data
    const opportunityData = responseData.data || responseData;
    return transformOpportunity(opportunityData);
  } catch (error) {
    console.error('Create opportunity failed:', error);
    throw error;
  }
},


// services/opportunityService.ts - Updated getOpportunities
async getOpportunities(category?: string): Promise<Opportunity[]> {
  try {
    const endpoint = `${API_BASE_URL}/opportunities`;
    console.log('Fetching opportunities from:', endpoint);
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle paginated response structure from your backend
    let opportunitiesArray = [];
    if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) {
        opportunitiesArray = data.data;
      } else if (Array.isArray(data)) {
        opportunitiesArray = data;
      }
    }
    
    // CLIENT-SIDE CATEGORY FILTERING
    if (category) {
      const categoryMap: { [key: string]: string } = {
        'Internships': 'INTERNSHIP',
        'Scholarships': 'SCHOLARSHIP',
        'Others': 'OTHER'
      };
      
      const backendCategory = categoryMap[category];
      if (backendCategory) {
        opportunitiesArray = opportunitiesArray.filter((opp: any) => opp.category === backendCategory);
      }
    }
    
    console.log(`Transforming ${opportunitiesArray.length} opportunities`);
    return opportunitiesArray.map(transformOpportunity);
  } catch (error) {
    console.error('Get opportunities failed:', error);
    return []; // Return empty array instead of fallback
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

// services/opportunityService.ts - Update searchOpportunities
async searchOpportunities(query: string): Promise<Opportunity[]> {
  try {
    // Since backend might not have search endpoint, implement client-side search
    // First try to use backend search if it exists
    try {
      const response = await fetch(`${API_BASE_URL}/opportunities/search?q=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        const opportunitiesArray = Array.isArray(data) ? data : (data.data || []);
        return opportunitiesArray.map(transformOpportunity);
      }
    } catch (searchError) {
      console.log('Backend search failed, using client-side filtering');
    }
    
    // Fallback to client-side search by fetching all and filtering
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