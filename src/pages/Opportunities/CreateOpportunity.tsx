import React, { useState, useEffect, useRef } from 'react';
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
    image: '', // Will store data URL
    requirements: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check authentication on component mount
  useEffect(() => {
    console.log('Current auth state:', { user, token: token ? 'Present' : 'Missing' });
    
    if (!user || !token) {
      setAuthError('Please log in to create opportunities');
    } else {
      setAuthError(null);
    }
  }, [user, token]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target?.result as string;
        setFormData(prev => ({ ...prev, image: dataURL }));
        setImagePreview(dataURL);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const inputEvent = {
        target: { files: [file] }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(inputEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Remove image
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

// CreateOpportunity.tsx - Add API URL validation
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Check if API_BASE_URL is defined
  if (!import.meta.env.VITE_OPPORTUNITIES_API_BASE_URL) {
    console.error('API_BASE_URL is undefined:', import.meta.env);
    alert('Configuration error: API URL is not set. Please check environment variables.');
    return;
  }
  
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
      image: formData.image || null,
      requirements: formData.requirements || null,
      tags: formData.tags.length > 0 ? formData.tags : null
    };
    
    console.log('API_BASE_URL:', import.meta.env.VITE_OPPORTUNITIES_API_BASE_URL);
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
    } else if (error.message.includes('405')) {
      setAuthError('Server error: Method not allowed. Please check API configuration.');
      alert('Server configuration error. Please try again later.');
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

              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-blue-100 border border-blue-400 rounded text-sm">
                  <Text className="text-blue-700">
                    Debug Info:
                  </Text>
                  <div className="mt-1 text-xs">
                    <div>User: {user ? `${user.email} (${user.id})` : 'Not logged in'}</div>
                    <div>Token: {token ? `${token.length} chars` : 'Missing'}</div>
                    <div>API URL: {import.meta.env.VITE_OPPORTUNITIES_API_BASE_URL || 'NOT SET!'}</div>
                    <div>Environment: {import.meta.env.MODE}</div>
                  </div>
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

                <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opportunity Image
              </label>
              
              {!formData.image ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                    disabled={!!authError || isLoading || isUploading}
                  />
                  
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#750015] mb-2"></div>
                      <Text className="text-gray-500">Uploading image...</Text>
                    </div>
                  ) : (
                    <>
                      <div className="mx-auto w-12 h-12 mb-3 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <Text className="text-gray-600 mb-1">
                        <span className="text-[#750015] font-semibold">Click to upload</span> or drag and drop
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        PNG, JPG, GIF up to 5MB
                      </Text>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative w-full max-w-xs mx-auto">
                    <img 
                      src={imagePreview || formData.image} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      disabled={!!authError || isLoading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <Text className="text-center text-sm text-gray-500">
                    Image ready for upload
                  </Text>
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
                disabled={isLoading || !!authError || isUploading}
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