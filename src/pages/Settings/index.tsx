import React, { Suspense, ChangeEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchInput } from "../../components/Input/SearchInput.tsx";
import { Text } from "../../components/Text/index.tsx";
import { Img } from "../../components/Img/index.tsx";
import { Input } from "../../components/Input/index.tsx";
import { Heading } from "../../components/Heading/index.tsx";
import { CloseSVG } from "../../components/Input/close.tsx";
import Sidebar1 from "../../components/Sidebar1/index.tsx";
import BottomNav from "../../components/BottomNav";
import { useAuth } from '../../auth/AuthContext';
import { toast } from 'react-toastify';
import {
  LogOut, Bell, Lock, User, Shield, Mail, HelpCircle, Moon, UserX,
  CheckCircle, XCircle
} from 'lucide-react';
import EditProfilePanel from "../../components/EditProfilePanel";
import { getProfile } from '../../services/API';
import { useNotification } from '../../context/NotificationContext';

export default function Settings() {
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const [notifications] = useState(false);
  const [darkMode] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const { 
    isNotificationSupported, 
    isNotificationEnabled, 
    notificationPermission,
    requestNotificationPermission,
    unregisterDevice 
  } = useNotification();

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const res = await getProfile(token);
          setIsVerified(res.data?.profile?.user?.is_verified ?? false);
          setProfilePicUrl(res.data?.profile?.user?.profile_pic_url ?? null);
        } catch {
          setIsVerified(false);
          setProfilePicUrl(null);
        }
      }
    };
    fetchProfile();
  }, [token]);

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleNotificationToggle = async () => {
    if (!isNotificationSupported) {
      toast.error('Notifications are not supported in this browser');
      return;
    }

    if (!isNotificationEnabled) {
      // Enable notifications
      await requestNotificationPermission();
    } else {
      // Show instructions for disabling notifications
      toast.info(
        'To disable notifications, please go to your browser settings and block notifications for this site.',
        { duration: 5000 }
      );
      
      // Optionally, you could show a modal with instructions
      const shouldShowInstructions = window.confirm(
        'To disable notifications, you need to update your browser settings.\n\n' +
        '1. Click the lock/info icon in your browser address bar\n' +
        '2. Change "Notifications" to "Block"\n' +
        '3. Refresh the page\n\n' +
        'Would you like to see detailed instructions?'
      );
      
      if (shouldShowInstructions) {
        // You could open a modal or navigate to a help page
        window.open('https://support.google.com/chrome/answer/3220216?hl=en', '_blank');
      }
    }
  };

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative animate-fade-in">
      <Sidebar1 onComplete={handleNavigation} currentPage="settings" />

      {/* Edit Profile Side Panel (desktop only) */}
      <div className="hidden lg:block">
        <EditProfilePanel
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
        />
      </div>

      <div className="flex w-full lg:w-[85%] pb-5 items-start justify-center  flex-row animate-slide-up">
        <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col lg:h-[100vh] max-h-full md:gap-[35px] lg:overflow-auto scrollbar-hide sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
          {/* Mobile Header */}
          <div className="mt-5 lg:hidden flex flex-row justify-between animate-fade-in">
            <div onClick={() => handleNavigation('user-profile')} className="hover:opacity-80 transition-opacity cursor-pointer">
              <Img
                src={
                  profilePicUrl && profilePicUrl.startsWith("http")
                    ? profilePicUrl
                    : "images/user.png"
                }
                alt="Profile"
                className="h-[32px] w-[32px] rounded-[50%]"
              />
            </div>
            <div>
              <Text className="font-semibold text-xl">Settings</Text>
            </div>
            <div>
              <Img src="images/vectors/search.svg" alt="Search" className="h-[20px] w-[20px]" />
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex flex-col gap-6">
            <Text className="text-2xl font-bold animate-slide-up">Settings</Text>

            {/* Account Settings */}
            <div className="bg-white rounded-xl p-6 animate-fade-in">
              <Text className="text-xl font-semibold mb-4">Account</Text>
              <div className="space-y-4">
                <button
                  className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => navigate("/settings/edit-profile")}
                >
                  <User size={20} />
                  <Text>Edit Profile</Text>
                </button>
                <button
                  className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => navigate("/settings/change-password")}
                >
                  <Lock size={20} />
                  <Text>Change Password</Text>
                </button>
                <button
                  className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors justify-between"
                  onClick={() => navigate("/settings/email-verification")}
                >
                  <span className="flex items-center gap-3">
                    <Mail size={20} />
                    <Text>Email Verification</Text>
                  </span>
                  {isVerified === null ? null : isVerified ? (
                    <CheckCircle className="text-green-600" size={22} />
                  ) : (
                    <XCircle className="text-red-500" size={22} />
                  )}
                </button>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Shield size={20} />
                  <Text>Privacy Settings</Text>
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl p-6 animate-fade-in">
              <Text className="text-xl font-semibold mb-4">Preferences</Text>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <Bell size={20} />
                    <div>
                      <Text>Notifications</Text>
                      <Text className="text-xs text-gray-500">
                        {!isNotificationSupported 
                          ? 'Not supported in this browser'
                          : notificationPermission === 'default'
                          ? 'Click to enable notifications'
                          : notificationPermission === 'granted'
                          ? 'Notifications are enabled'
                          : 'Notifications are blocked'
                        }
                      </Text>
                    </div>
                  </div>
                  {isNotificationSupported ? (
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isNotificationEnabled}
                          onChange={handleNotificationToggle}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#750015]"></div>
                      </label>
                      {/* {isNotificationEnabled && (
                        <button
                          onClick={() => {
                            toast.info('To disable notifications, please update your browser settings.');
                            window.open('https://support.google.com/chrome/answer/3220216?hl=en', '_blank');
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                          How to disable?
                        </button>
                      )} */}
                    </div>
                  ) : (
                    <label className="relative inline-flex items-center cursor-not-allowed">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={false}
                        disabled
                        readOnly
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#750015] opacity-50"></div>
                    </label>
                  )}
                </div>
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <Moon size={20} />
                    <Text>Dark Mode</Text>
                  </div>
                  <label className="relative inline-flex items-center cursor-not-allowed">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={darkMode}
                      disabled
                      readOnly
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#750015] opacity-50"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-xl p-6 animate-fade-in">
              <Text className="text-xl font-semibold mb-4">Support</Text>
              <div className="space-y-4">
                <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <HelpCircle size={20} />
                  <Text><a href="https://chat.whatsapp.com/EGY8l7P0ZqT6DIrXp8YgAx" target="_blank" rel="noopener noreferrer">Help Center</a></Text>
                </button>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Text><a href="https://chat.whatsapp.com/EGY8l7P0ZqT6DIrXp8YgAx" target="_blank" rel="noopener noreferrer">Feedback</a></Text>
                </button>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Text>Terms of Service</Text>
                </button>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => navigate("/settings/privacy-policy")}
                >
                  <Text>Privacy Policy</Text>
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors animate-slide-up"
            >
              <LogOut size={20} />
              <Text>Logout</Text>
            </button>
            {/* Deactivate Button */}
            <button
              className="flex items-center gap-3 w-full p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors animate-slide-up"
            >
              <UserX size={20} />
              <Text>Deactivate</Text>
            </button>
          </div>
        </div>
      </div>

      <BottomNav onComplete={handleNavigation} currentPage="settings" />
    </div>
  );
}
