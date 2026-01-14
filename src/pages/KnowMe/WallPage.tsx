import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import '../../styles/animations.css';

interface WallMember {
  id: string;
  full_name: string;
  contact_info: string;
  interests: string;
  photo_url: string | null;
  joined_at: string;
}

interface Wall {
  id: string;
  name: string;
  description: string;
  member_count: number;
  creator_email: string;
  created_at: string;
}

export const WallPage = () => {
  const navigate = useNavigate();
  const { wallId } = useParams();
  const [wall, setWall] = useState<Wall | null>(null);
  const [members, setMembers] = useState<WallMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchWallData = async () => {
      try {
        setIsLoading(true);
        // Fetch wall details
        const wallRes = await api.get(`/walls/${wallId}/`);
        setWall(wallRes.data);

        // Fetch members
        const membersRes = await api.get(`/walls/${wallId}/members/`, {
          params: { page: 1, page_size: 50 }
        });
        setMembers(membersRes.data.results);
        setTotalCount(membersRes.data.count);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load wall');
        console.error('Wall fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (wallId) {
      fetchWallData();
    }
  }, [wallId]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-600">Loading wall...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {wall && !isLoading && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1a1a1a]">{wall.name}</h1>
                <p className="text-sm text-gray-600 mt-1"> {wall.description}</p>
              </div>
              <div className="bg-[#760016] text-white px-6 py-3 rounded-lg font-bold text-xl">
                {totalCount}
              </div>
            </div>

            {/* Members Grid */}
            {members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
                {members.map((member, index) => {
                  const memberNumber = totalCount - index;
                  return (
                    <div 
                      key={member.id} 
                      className="bg-white rounded-2xl p-6 shadow-sm relative"
                      style={{
                        animation: `slideInUp 0.6s ease-out ${index * 0.15}s forwards`
                      }}
                    >
                      <div className="absolute top-4 right-4 bg-white border border-gray-300 rounded-full px-3 py-1 text-sm font-medium">
                        {memberNumber}
                      </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200">
                        {member.photo_url ? (
                          (() => {
                            const bucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
                            const isHttp = /^https?:\/\//i.test(member.photo_url);
                            const displayUrl = isHttp
                              ? member.photo_url
                              : `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(member.photo_url)}?alt=media`;
                            return (
                              <img
                                src={displayUrl}
                                alt={member.full_name}
                                className="w-full h-full object-cover"
                              />
                            );
                          })()
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="8" r="4" stroke="#999" strokeWidth="2"/>
                              <path d="M 6 20 Q 6 16 12 16 Q 18 16 18 20" stroke="#999" strokeWidth="2"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">{member.full_name}</h3>
                      <div className="text-sm text-gray-700 mb-2 break-words">
                        {member.contact_info.split(/\s+/).map((part, idx) => {
                          const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/;
                          if (urlRegex.test(part)) {
                            const url = part.startsWith('http') ? part : `https://${part}`;
                            return (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#760016] hover:underline"
                              >
                                {part}{' '}
                              </a>
                            );
                          }
                          return <span key={idx}>{part} </span>;
                        })}
                      </div>
                      <p className="text-sm text-gray-600">{member.interests}</p>
                    </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <p>No members yet. Be the first to join!</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="fixed bottom-8 left-0 right-0 px-4 flex justify-center gap-4">
              <button
                onClick={() => {
                  const wallLink = `${window.location.origin}/knowme/wall/${wallId}`;
                  if (navigator.share) {
                    navigator.share({
                      title: wall.name,
                      text: "Join The Wall: " + wall.description,
                      url: wallLink,
                    }).catch(err => console.log('Error sharing:', err));
                  } else {
                    navigator.clipboard.writeText(wallLink);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="bg-white border-2 border-[#760016] rounded-full p-4 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Share"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="#760016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="#760016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="#760016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.59 13.51L15.42 17.49" stroke="#760016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.41 6.51L8.59 10.49" stroke="#760016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <button
                onClick={() => navigate(`/knowme/join/${wallId}`)}
                className="bg-[#760016] text-white px-8 py-4 rounded-full shadow-lg font-semibold text-lg hover:bg-[#8a001c] transition-colors"
              >
                Join Wall
              </button>

              <button
                onClick={() => navigate('/knowme/create-wall')}
                className="bg-white border-2 border-[#760016] rounded-full p-4 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Add"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19" stroke="#760016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12H19" stroke="#760016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
