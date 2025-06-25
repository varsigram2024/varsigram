import React from 'react';
import { Text } from './Text';
import { Img } from './Img';
import { navigate } from 'react-router-dom';

interface ClickableUserProps {
  displayNameSlug: string;
  profilePicUrl?: string | null;
  displayName?: string;
  onUserClick: (displayNameSlug: string) => void;
  size?: 'small' | 'medium' | 'large';
  showVerified?: boolean;
}

export const ClickableUser: React.FC<ClickableUserProps> = ({
  displayNameSlug,
  profilePicUrl,
  displayName,
  onUserClick,
  size = 'medium',
  showVerified = false
}) => {
  const sizeClasses = {
    small: 'h-[24px] w-[24px]',
    medium: 'h-[32px] w-[32px]',
    large: 'h-[48px] w-[48px]'
  };

  return (
    <div 
      className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => onUserClick(displayNameSlug)}
    >
      <Img
        src={profilePicUrl || '/images/user.png'}
        alt={displayName || displayNameSlug}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      <div className="flex items-center gap-1">
        <Text className="font-medium hover:underline">
          {displayName || displayNameSlug}
        </Text>
        {showVerified && (
          <Img src="images/vectors/verified.svg" alt="Verified" className="h-[12px] w-[12px]" />
        )}
      </div>
    </div>
  );
};
