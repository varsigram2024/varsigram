// Create a new file: context/ViewTrackingContext.tsx
import React, { createContext, useContext, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

interface ViewTrackingContextType {
  addToBatch: (postId: string) => void;
}

const ViewTrackingContext = createContext<ViewTrackingContextType>({
  addToBatch: () => {},
});

export const useViewTracking = () => useContext(ViewTrackingContext);

export const ViewTrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const batch = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendBatch = useCallback(async () => {
    if (batch.current.size === 0 || !token) return;

    const postIds = Array.from(batch.current);
    batch.current.clear();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/posts/batch-view/`,
        { post_ids: postIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to increment view counts:', error);
      // Add the failed IDs back to the batch for retry
      postIds.forEach(id => batch.current.add(id));
    }
  }, [token]);

  const addToBatch = useCallback((postId: string) => {
    batch.current.add(postId);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout to send batch after 500ms of inactivity
    timeoutRef.current = setTimeout(sendBatch, 500);
  }, [sendBatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (batch.current.size > 0) {
        sendBatch();
      }
    };
  }, [sendBatch]);

  return (
    <ViewTrackingContext.Provider value={{ addToBatch }}>
      {children}
    </ViewTrackingContext.Provider>
  );
};