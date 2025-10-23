// CreateOpportunity.tsx - Updated with image field
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../../components/Heading';
import { Text } from '../../components/Text';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { opportunityService, type Opportunity } from '../../services/opportunityService';
import { useAuth } from '../../auth/AuthContext';

const CreateOpportunity: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    category: 'INTERNSHIP' as 'INTERNSHIP' | 'SCHOLARSHIP' | 'OTHER',
    location: '',
    description: '',
    isRemote: false,
    deadline: '',
    contactEmail: '',
    image: '', // Added image field
    requirements: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');

  // Check authentication on component mount
  useEffect(() => {
    console.log('Current auth state:', { user, token: token ? 'Present' : 'Missing' });
    
    if (!user || !token) {
      setAuthError('Please log in to create opportunities');
    } else {
      setAuthError(null);
    }
  }, [user, token]);

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !token) {
      setAuthError('Please log in to create opportunities');
      alert('Please log in first');
      return;
    }
    
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Prepare data for backend
      const submissionData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location || null,
        isRemote: formData.isRemote,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        contactEmail: formData.contactEmail || null,
        organization: formData.organization || null,
        image: formData.image || null, // Include image
        requirements: formData.requirements || null,
        tags: formData.tags.length > 0 ? formData.tags : null
      };
      
      console.log('Submitting opportunity data:', submissionData);
      
      const newOpportunity = await opportunityService.createOpportunity(submissionData);
      console.log('Opportunity created successfully:', newOpportunity);
      
      if (!newOpportunity.id) {
        throw new Error('Created opportunity has no ID');
      }
      
      navigate(`/opportunities/${newOpportunity.id}`);
    } catch (error: any) {
      console.error('Failed to create opportunity:', error);
      
      if (error.message.includes('Authentication required') || error.message.includes('401')) {
        setAuthError('Authentication failed. Please log in again.');
        alert('Authentication failed. Please log in again.');
      } else {
        alert(`Failed to create opportunity: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/welcome');
  };

  return (
    <div className="flex w-full bg-white min-h-screen">
      <div className="flex-1 p-6 items-center justify-center lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Heading as="h1" className="text-2xl lg:text-3xl font-bold text-gray-900">
              Create Opportunity
            </Heading>
          </div>

          {/* Auth Error */}
          {authError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
              <Text className="text-red-700 mb-2">{authError}</Text>
              <div className="flex gap-2">
                <Button
                  onClick={handleLoginRedirect}
                  className="bg-[#750015] text-white px-4 py-2 rounded-lg"
                >
                  Go to Login
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Refresh
                </Button>
              </div>
            </div>
          )}

          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-400 rounded text-sm">
              <Text className="text-blue-700">
                Debug: User: {user ? user.email : 'Not logged in'}, Token: {token ? 'Present' : 'Missing'}
              </Text>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opportunity Title *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Research Internship in Machine Learning"
                  value={formData.title}
                  onChange={(e: any) => setFormData({...formData, title: e.target.value})}
                  className="rounded-lg border-gray-300"
                  required
                  disabled={!!authError || isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization *
                </label>
                <Input
                  type="text"
                  placeholder="Your organization name"
                  value={formData.organization}
                  onChange={(e: any) => setFormData({...formData, organization: e.target.value})}
                  className="rounded-lg border-gray-300"
                  required
                  disabled={!!authError || isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opportunity Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#750015] focus:border-transparent"
                  required
                  disabled={!!authError || isLoading}
                >
                  <option value="INTERNSHIP">Internship</option>
                  <option value="SCHOLARSHIP">Scholarship</option>
                  <option value="COMPETITION">Competition</option>
                  <option value="GIG">Gig</option>
                  <option value="PITCH">Pitch</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Remote, Lagos, NG"
                  value={formData.location}
                  onChange={(e: any) => setFormData({...formData, location: e.target.value})}
                  className="rounded-lg border-gray-300"
                  required
                  disabled={!!authError || isLoading}
                />
              </div>
            </div>

            {/* Image URL Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opportunity Image URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e: any) => setFormData({...formData, image: e.target.value})}
                className="rounded-lg border-gray-300"
                disabled={!!authError || isLoading}
              />
              <Text className="text-sm text-gray-500 mt-1">
                Provide a direct link to an image that represents this opportunity
              </Text>
              
              {/* Image Preview */}
              {formData.image && (
                <div className="mt-3">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Image Preview:</Text>
                  <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/opportunity.png';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Remote Work Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRemote"
                checked={formData.isRemote}
                onChange={(e) => setFormData({...formData, isRemote: e.target.checked})}
                className="h-4 w-4 text-[#750015] focus:ring-[#750015] border-gray-300 rounded"
                disabled={!!authError || isLoading}
              />
              <label htmlFor="isRemote" className="ml-2 block text-sm text-gray-700">
                This is a remote opportunity
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                placeholder="Describe the opportunity, responsibilities, and what makes it unique..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#750015] focus:border-transparent resize-none"
                required
                disabled={!!authError || isLoading}
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <textarea
                placeholder="List the requirements, qualifications, and skills needed..."
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#750015] focus:border-transparent resize-none"
                disabled={!!authError || isLoading}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Add a tag (e.g., remote, tech, engineering)"
                  value={tagInput}
                  onChange={(e: any) => setTagInput(e.target.value)}
                  onKeyPress={(e: any) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="rounded-lg border-gray-300 flex-1"
                  disabled={!!authError || isLoading}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                  disabled={!!authError || isLoading}
                >
                  Add
                </Button>
              </div>
              
              {/* Tags Display */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        disabled={!!authError || isLoading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline *
                </label>
                <Input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e: any) => setFormData({...formData, deadline: e.target.value})}
                  className="rounded-lg border-gray-300"
                  required
                  disabled={!!authError || isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <Input
                  type="email"
                  placeholder="contact@organization.com"
                  value={formData.contactEmail}
                  onChange={(e: any) => setFormData({...formData, contactEmail: e.target.value})}
                  className="rounded-lg border-gray-300"
                  required
                  disabled={!!authError || isLoading}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium disabled:opacity-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !!authError}
                className="px-6 py-3 bg-[#750015] text-white hover:bg-[#5a0010] rounded-lg font-medium disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Opportunity'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOpportunity;