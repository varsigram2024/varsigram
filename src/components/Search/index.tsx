import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Img } from '../Img';
import { Post } from '../Post/index.tsx';
import { faculties, facultyDepartments } from '../../constants/academic';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: {
    users: Array<{
      id: string;
      fullName: string;
      display_name_slug?: string;
      faculty?: string;
      department?: string;
      type: 'student' | 'organization';
    }>;
    posts: Array<any>;
  };
  isSearching: boolean;
  searchType: 'all' | 'student' | 'organization';
  setSearchType: (type: 'all' | 'student' | 'organization') => void;
  searchFaculty: string;
  setSearchFaculty: (faculty: string) => void;
  searchDepartment: string;
  setSearchDepartment: (department: string) => void;
  handleSearch: () => void;
  handlePostUpdate: (post: any) => void;
  handlePostDelete: (post: any) => void;
  handlePostEdit: (post: any) => void;
  currentUser: { id?: string; email?: string };
}

export const Search: React.FC<SearchProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  searchType,
  setSearchType,
  searchFaculty,
  setSearchFaculty,
  searchDepartment,
  setSearchDepartment,
  handleSearch,
  handlePostUpdate,
  handlePostDelete,
  handlePostEdit,
  currentUser
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center md:items-center justify-center p-2 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl md:rounded-[32px] w-full h-full md:h-auto max-h-screen md:max-h-[80vh] overflow-y-auto shadow-lg p-4 md:p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="cursor-pointer" onClick={onClose}>
              <Img src="images/vectors/x.svg" alt="Close" className="h-6 w-6" />
            </div>
            <input
              type="text"
              className="flex-1 text-lg border-none outline-none"
              placeholder="Search Varsigram..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              autoFocus
            />
            {searchQuery && (
              <button
                className="text-[#750015] font-medium"
                onClick={handleSearch}
                disabled={isSearching}
              >
                Search
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3">
            <select
              className="border rounded px-2 py-1"
              value={searchType}
              onChange={e => setSearchType(e.target.value as any)}
            >
              <option value="student">Students</option>
              <option value="organization">Organizations</option>
              <option value="all">All Types</option>
            </select>
            <select
              className="border rounded px-2 py-1"
              value={searchFaculty}
              onChange={e => {
                setSearchFaculty(e.target.value);
                setSearchDepartment("");
              }}
            >
              <option value="">Select Faculties</option>
              {faculties.map(faculty => (
                <option key={faculty} value={faculty}>{faculty}</option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-1"
              value={searchDepartment}
              onChange={e => setSearchDepartment(e.target.value)}
              disabled={!searchFaculty}
            >
              <option value="">Select Departments</option>
              {(facultyDepartments[searchFaculty] || []).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          {isSearching ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#750015]"></div>
            </div>
          ) : (
            <div className="p-4">
              {searchResults.users.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">People</h3>
                  <div className="space-y-4">
                    {searchResults.users.map((user) => (
                      <div 
                        key={user.id} 
                        className="flex flex-col gap-1 cursor-pointer" 
                        onClick={() => {
                          if (user.display_name_slug) {
                            navigate(`/user-profile/${user.display_name_slug}`);
                            onClose();
                          }
                        }}
                      >
                        <div className="font-semibold">{user.fullName}</div>
                        {user.type === "student" && (
                          <div className="text-xs text-gray-500">
                            {user.faculty} {user.department && `- ${user.department}`}
                          </div>
                        )}
                        {user.type === "organization" && (
                          <div className="text-xs text-gray-500">Organization</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.posts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Posts</h3>
                  <div className="space-y-4">
                    {searchResults.posts.map((post) => (
                      <Post
                        key={post.id}
                        post={post}
                        onPostUpdate={handlePostUpdate}
                        onPostDelete={handlePostDelete}
                        onPostEdit={handlePostEdit}
                        currentUserId={currentUser.id}
                        currentUserEmail={currentUser.email}
                        onClick={() => {
                          sessionStorage.setItem('homepageScroll', window.scrollY.toString());
                          navigate(`/posts/${post.id}`);
                          onClose();
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {searchQuery && 
               !isSearching && 
               searchResults.users.length === 0 && 
               searchResults.posts.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};