import React, { useState } from 'react';
import { Text } from './Text';
import { Button } from './Button';

interface EditPostModalProps {
  post: {
    content: string;
    slug: string;
  };
  onClose: () => void;
  onSubmit: (content: string) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose, onSubmit }) => {
  const [editedContent, setEditedContent] = useState(post.content);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <Text className="text-xl font-bold mb-4">Edit Post</Text>
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
          rows={4}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSubmit(editedContent)}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
