import React, { Suspense, ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import { SearchInput } from "../../components/Input/SearchInput.tsx";
import { Text } from "../../components/Text/index.tsx";
import { Img } from "../../components/Img/index.tsx";
import { Input } from "../../components/Input/index.tsx";
import { Heading } from "../../components/Heading/index.tsx";
import { CloseSVG } from "../../components/Input/close.tsx";
import Sidebar1 from "../../components/Sidebar1/index.tsx";
import UserProfile1 from "../../components/UserProfile1/index.tsx";
import ProfileOrganizationSection from "../ProfilepageOrganization/ProfilepageOrganizationSection.tsx";
import { Button } from "../../components/Button.tsx";
import CreateConversation from "../../modals/createCONVERSATION/index.tsx";
import BottomNav from "../../components/BottomNav/index.tsx";

interface DataItem {
  deanof: string;
  p138kfollowers: string;
}

interface User {
  id: number;
  userName: string;
  userImage: string;
  isVerified: boolean;
  bio?: string;
}

interface ConnectionspageProps {
  onComplete: (page: string) => void;
}

const dummyUsers: User[] = [
  {
    id: 1,
    userName: "UNILAG",
    userImage: "images/unilag-logo.png",
    isVerified: true,
    bio: "The University of Lagos"
  },
  {
    id: 2,
    userName: "DSA, Unilag",
    userImage: "images/unilag-logo.png",
    isVerified: false,
    bio: "Deen Student Affairs, UNILAG"
  },
  {
    id: 3,
    userName: "Medical Center",
    userImage: "images/prompts/medical.png",
    isVerified: true,
    bio: "Healthly Body and Mind"
  },
  {
    id: 4,
    userName: "NESA",
    userImage: "images/prompts/nesa.png",
    isVerified: true,
    bio: "NESA, UNILAG"
  },
  {
    id: 5,
    userName: "MSSN",
    userImage: "images/prompts/mssn.png",
    isVerified: false,
    bio: "MSSN, UNILAG"
  },
  {
    id: 1,
    userName: "UNILAG",
    userImage: "images/unilag-logo.png",
    isVerified: true,
    bio: "The University of Lagos"
  },
  {
    id: 2,
    userName: "DSA, Unilag",
    userImage: "images/unilag-logo.png",
    isVerified: false,
    bio: "Deen Student Affairs, UNILAG"
  },
  {
    id: 3,
    userName: "Medical Center",
    userImage: "images/prompts/medical.png",
    isVerified: true,
    bio: "Healthly Body and Mind"
  },
  {
    id: 4,
    userName: "NESA",
    userImage: "images/prompts/nesa.png",
    isVerified: true,
    bio: "NESA, UNILAG"
  },
  {
    id: 5,
    userName: "MSSN",
    userImage: "images/prompts/mssn.png",
    isVerified: false,
    bio: "MSSN, UNILAG"
  },
  {
    id: 1,
    userName: "UNILAG",
    userImage: "images/unilag-logo.png",
    isVerified: true,
    bio: "The University of Lagos"
  },
  {
    id: 2,
    userName: "DSA, Unilag",
    userImage: "images/unilag-logo.png",
    isVerified: false,
    bio: "Deen Student Affairs, UNILAG"
  },
  {
    id: 3,
    userName: "Medical Center",
    userImage: "images/prompts/medical.png",
    isVerified: true,
    bio: "Healthly Body and Mind"
  },
  {
    id: 4,
    userName: "NESA",
    userImage: "images/prompts/nesa.png",
    isVerified: true,
    bio: "NESA, UNILAG"
  },
  {
    id: 5,
    userName: "MSSN",
    userImage: "images/prompts/mssn.png",
    isVerified: false,
    bio: "MSSN, UNILAG"
  },
];

export default function Connectionspage({ onComplete }: ConnectionspageProps) {
  const [searchBarValue, setSearchBarValue] = useState("");
  const [searchBarValue6, setSearchBarValue6] = useState("");
  const [searchBarValue7, setSearchBarValue7] = useState("");
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [isCreateConversationOpen, setIsCreateConversationOpen] = useState(false);
  const [conversationText, setConversationText] = useState("");

  const handleClearSearch = () => setSearchBarValue("");

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative h-auto overflow-hidden">
      <Sidebar1 onComplete={onComplete} currentPage="connections" />

      <div className="flex w-full lg:w-[85%] items-start justify-center h-[100vh] flex-row">
        <div className="mt-[0px] lg:mt-[0px] flex flex-1 items-center justify-center gap-[45px] md:flex-col md:self-stretch overflow-scroll scrollbar-hide"> 
          <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col lg:h-[100vh] max-h-full md:gap-[35px] lg:overflow-auto scrollbar-hide sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
           

          <div className="mt-5 lg:hidden flex flex-row justify-between">
              <div 
                  onClick={() => onComplete('user-profile')} 
                  className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Img src="images/user-image.png" alt="File" className="h-[32px] w-[32px] rounded-[50%]" />
              </div>

              <div>
                <Text className="font-semibold text-xl">Connections</Text>
              </div>

              <div>
                <Img src="images/vectors/search.svg" alt="Search" className="h-[20px] w-[20px]" />
              </div>

            </div>


            <div className="lg:mt-5 flex justify-between">
              <div 
                className={`flex px-3 cursor-pointer ${activeTab === 'forYou' ? 'border-b-2 border-solid border-[#750015]' : ''}`}
                onClick={() => setActiveTab('forYou')}
              >
                <Text as="p" className={`text-[14px] font-medium md:text-[22px] ${activeTab === 'forYou' ? '' : '!text-[#adacb2]'}`}>
                Who to Follow
                </Text>
              </div>
              <div 
                className={`flex border-b-2 border-solid px-1.5 cursor-pointer ${activeTab === 'following' ? 'border-[#750015]' : 'border-transparent'}`}
                onClick={() => setActiveTab('following')}
              >
                <Text as="p" className={`text-[14px] font-medium md:text-[22px] ${activeTab === 'following' ? '' : '!text-[#adacb2]'}`}>
                  Following
                </Text>
              </div>
            </div>
          


            

            

            

            <div className="relative w-full">
              <div 
                className={`transition-all duration-300 ease-in-out ${activeTab === 'forYou' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute'}`}
              >
                {activeTab === 'forYou' && (
                  <>
                    <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
                      {dummyUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between w-full py-4 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center gap-3">
                            <Img
                              src={user.userImage}
                              alt={user.userName}
                              className="h-[48px] w-[48px] rounded-[50%]"
                            />
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <Text className="font-semibold">{user.userName}</Text>
                                {user.isVerified && (
                                  <Img
                                    src="images/vectors/verified.svg"
                                    alt="verified"
                                    className="h-[16px] w-[16px]"
                                  />
                                )}
                              </div>
                              <Text className="text-sm text-gray-500">{user.bio}</Text>
                            </div>
                          </div>
                          <Button
                            className="text-sm bg-[#750015] text-white rounded-full hover:bg-[#8c0019] transition-colors"
                          >
                            Follow
                          </Button>
                        </div>
                      ))}
                    </div>

                  </>
                )}
              </div>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${activeTab === 'following' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}
              >
                {activeTab === 'following' && (
                  <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
                    {dummyUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between w-full py-4 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <Img
                            src={user.userImage}
                            alt={user.userName}
                            className="h-[48px] w-[48px] rounded-[50%]"
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <Text className="font-semibold">{user.userName}</Text>
                              {user.isVerified && (
                                <Img
                                  src="images/vectors/verified.svg"
                                  alt="verified"
                                  className="h-[16px] w-[16px]"
                                />
                              )}
                            </div>
                            <Text className="text-sm text-gray-500">{user.bio}</Text>
                          </div>
                        </div>
                        <Button
                          className="px-4 py-2 bg-gray-400 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          Following
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        


      </div>


      <BottomNav onComplete={onComplete} currentPage="connections" />
    </div>
  );
}
