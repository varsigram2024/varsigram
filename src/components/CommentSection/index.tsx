import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import { Img } from "../Img";
import { Text } from "../Text";

interface Comment {
  id: string;
  text: string;
  timestamp: string;
  author_username: string;
  author_id: string;
  post_id: string;
}

interface CommentSectionProps {
  postId: string;
  open: boolean;
  onClose: () => void;
}

export default function CommentSection({ postId, open, onClose }: CommentSectionProps) {
  const { token, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !postId) return;
    fetchComments();
    // eslint-disable-next-line
  }, [open, postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.varsigram.com/api/v1/posts/${postId}/comments/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(response.data);
    } catch {
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `https://api.varsigram.com/api/v1/posts/${postId}/comments/create/`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  // Drag up/down logic (basic)
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    let startY = 0;
    let currentY = 0;
    let dragging = false;

    const onTouchStart = (e: TouchEvent) => {
      dragging = true;
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      if (diff > 60) onClose();
    };
    const onTouchEnd = () => {
      dragging = false;
    };

    sheet.addEventListener("touchstart", onTouchStart);
    sheet.addEventListener("touchmove", onTouchMove);
    sheet.addEventListener("touchend", onTouchEnd);

    return () => {
      sheet.removeEventListener("touchstart", onTouchStart);
      sheet.removeEventListener("touchmove", onTouchMove);
      sheet.removeEventListener("touchend", onTouchEnd);
    };
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="inset-0 z-50 flex items-end justify-center w-full bg-black bg-opacity-40">
      <div
        ref={sheetRef}
        className="w-full bg-white rounded-t-2xl shadow-lg p-4 transition-transform duration-300"
        style={{ minHeight: "40vh", maxHeight: "80vh", overflowY: "auto" }}
      >
        <div className="flex justify-center mb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>
        <div className="flex justify-between items-center mb-4">
          <Text as="h3" className="text-lg font-semibold">Comments</Text>
          <button onClick={onClose} className="text-gray-500 text-xl">&times;</button>
        </div>
        <div className="space-y-4 mb-4">
          {isLoading ? (
            <Text>Loading...</Text>
          ) : comments.length === 0 ? (
            <Text>No comments yet.</Text>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 items-start">
                <div>
                  <Text className="font-semibold">{comment.author_username}</Text>
                  <Text className="block">{comment.text}</Text>
                  <Text className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleString()}</Text>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            className="flex-1 border rounded-full px-4 py-2"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#750015] text-white px-4 py-2 rounded-full"
            disabled={!newComment.trim()}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
