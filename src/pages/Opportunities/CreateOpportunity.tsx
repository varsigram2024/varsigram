// CreateOpportunity.tsx - Updated Create Opportunity Page
import React, { useState } from 'react';
import { Heading } from '../../components/Heading';
import { Text } from '../../components/Text';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Img } from '../../components/Img';

const CreateOpportunity: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    type: '',
    location: '',
    description: '',
    requirements: '',
    deadline: '',
    tags: [] as string[],
    contactEmail: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="flex w-full bg-white min-h-screen">


      {/* Main Content */}
      <div className="flex-1 p-6 items-center justify-center lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center justify-center">
              <Heading as="h1" className="text-2xl lg:text-3xl font-bold text-gray-900">
                Create Opportunity
              </Heading>
            </div>
          </div>

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
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opportunity Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#750015] focus:border-transparent"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Internship">Internship</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Job">Job</option>
                  <option value="Research">Research</option>
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
                />
              </div>
            </div>

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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <textarea
                placeholder="List the eligibility criteria, skills required, and any prerequisites..."
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#750015] focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline *
                </label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e: any) => setFormData({...formData, deadline: e.target.value})}
                  className="rounded-lg border-gray-300"
                  required
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
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              >
                Save as Draft
              </Button>
              <Button
                type="submit"
                className="px-6 py-3 bg-[#750015] text-white hover:bg-[#5a0010] rounded-lg font-medium"
              >
                Continue to Details
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOpportunity;