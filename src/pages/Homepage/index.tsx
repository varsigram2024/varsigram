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
import { Button } from "../../components/Button";
import CreateConversation from "../../modals/createCONVERSATION";
import BottomNav from "../../components/BottomNav";

interface DataItem {
  deanof: string;
  p138kfollowers: string;
}

interface HomepageProps {
  onComplete: (page: string) => void;
}

export default function Homepage({ onComplete }: HomepageProps) {
  const [searchBarValue, setSearchBarValue] = useState("");
  const [searchBarValue6, setSearchBarValue6] = useState("");
  const [searchBarValue7, setSearchBarValue7] = useState("");
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [isCreateConversationOpen, setIsCreateConversationOpen] = useState(false);
  const [conversationText, setConversationText] = useState("");

  const handleClearSearch = () => setSearchBarValue("");

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative h-auto overflow-hidden">
      <Sidebar1 onComplete={onComplete} currentPage="home" />

      <div className="flex w-full lg:w-[85%] items-start justify-center h-[100vh] flex-row">
        <div className="mt-[38px] lg:mt-[0px] flex flex-1 items-center justify-center gap-[45px] md:flex-col md:self-stretch h-[100vh] overflow-scroll scrollbar-hide"> 
          <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col lg:h-[100vh] max-h-full md:gap-[35px] lg:overflow-auto scrollbar-hide sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
            <div className="flex items-center gap-2.5">
              <div 
                onClick={() => onComplete('user-profile')} 
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Text as="p" className="text-[24px] font-medium md:text-[22px]">
                  Welcome back, Mahmud 👋
                </Text>
              </div>
              {/* <img src="images/vectors/verified.svg" alt="User" className="h-[20px] w-[20px]" /> */}
            </div>
            <div className="mt-12 lg:mt-5 flex justify-between">
              <div 
                className={`flex px-3 cursor-pointer ${activeTab === 'forYou' ? 'border-b-2 border-solid border-[#750015]' : ''}`}
                onClick={() => setActiveTab('forYou')}
              >
                <Text as="p" className={`text-[14px] font-medium md:text-[22px] ${activeTab === 'forYou' ? '' : '!text-[#adacb2]'}`}>
                  For you
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
          
            <div 
              className="mt-8 lg:mt-0 flex justify-center rounded-[28px] bg-[#ffffff] p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsCreateConversationOpen(true)}
            >
              <input
                type="text"
                value={conversationText}
                onChange={(e) => setConversationText(e.target.value)}
                placeholder="Create a conversation"
                className="w-full text-[20px] font-normal text-[#adacb2] bg-transparent border-none outline-none focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreateConversationOpen(true);
                }}
                readOnly // Make it read-only since we'll use the modal for input
              />
              <div className="flex flex-1 justify-end items-center gap-6 px-1.5">
                <Img src="images/vectors/image.svg" alt="Image" className="lg:h-[24px] lg:w-[24px] h-[14px] w-[14px] cursor-pointer" />
                <Img src="images/vectors/camera.svg" alt="Camera" className="lg:h-[24px] lg:w-[24px] h-[14px] w-[14px] cursor-pointer" />
                <Img src="images/vectors/video.svg" alt="Upload" className="lg:h-[24px] lg:w-[24px] h-[14px] w-[14px] cursor-pointer" />
              </div>
            </div>

            <div className="relative w-full">
              <div 
                className={`transition-all duration-300 ease-in-out ${activeTab === 'forYou' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute'}`}
              >
                {activeTab === 'forYou' && (
                  <>
                    <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
                      <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-6">
                          <div className="flex items-start justify-between gap-5 md:flex-col">
                            <div className="flex items-center">
                              <div className="w-[32px] lg:w-[64px] rounded-[32px] bg-[#e6e6e699] px-1 py-2">
                                <Img src="images/unilag-logo.png" alt="Unilag Logo" className="h-auto lg:h-[48px] w-full object-cover" />
                              </div>
                              <div className="flex flex-1 flex-col items-start px-4">
                                <span className="flex items-center gap-1.5 self-stretch w-auto">
                                  <Text as="p" className="text-[14px] font-extrabold md:text-[22px]">For You Post 1</Text>
                                  <Img src="images/vectors/verified.svg" alt="Verified Icon" className="h-[16px] w-[16px]" />
                                </span>
                                <Text as="p" className="mt-[-2px] text-[14px] font-normal text-[#adacb2]">Just now</Text>
                              </div>
                            </div>
                          </div>
                          <div className="h-px bg-[#d9d9d9]" />
                        </div>

                        <Text size="body_large_regular" as="p" className="text-[12px] lg:text-[20px] font-normal leading-[30px]">
                          This is a post from someone the algorithm. You can customize this content based on your needs.
                        </Text>

                        <div className="h-px bg-[#d9d9d9]" />

                        <div className="flex flex-col gap-3.5">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1 lg:gap-2">
                              <Img src="images/vectors/like.svg" alt="Likes" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">1.2K</Text>
                            </div>
                            <div className="flex items-center gap-1 lg:gap-2">
                              <Img src="images/vectors/vers.svg" alt="Search" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">500</Text>
                            </div>
                            <div className="flex items-center gap-1 lg:gap-2">
                              <Img src="images/vectors/revers.svg" alt="Repost" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">300</Text>
                            </div>
                            <Img src="images/vectors/share.svg" alt="Share" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
                      <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-6">
                          <div className="flex items-start justify-between gap-5 md:flex-col">
                            <div className="flex items-center">
                              <div className="w-[32px] lg:w-[64px] rounded-[32px] bg-[#e6e6e699] px-1 py-2">
                                <Img src="images/prompts/mssn.png" alt="Unilag Logo" className="h-auto lg:h-[48px] w-full object-cover" />
                              </div>
                              <div className="flex flex-1 flex-col items-start px-4">
                                <span className="flex items-center gap-1.5 self-stretch w-auto">
                                  <Text as="p" className="text-[14px] font-extrabold md:text-[22px]">For You Post 2</Text>
                                  <Img src="images/vectors/verified.svg" alt="Verified Icon" className="h-[16px] w-[16px]" />
                                </span>
                                <Text as="p" className="mt-[-2px] text-[14px] font-normal text-[#adacb2]">5m</Text>
                              </div>
                            </div>
                          </div>
                          <div className="h-px bg-[#d9d9d9]" />
                        </div>

                        <Text size="body_large_regular" as="p" className="text-[12px] lg:text-[20px] font-normal leading-[30px]">
                          This is a post from someone the algorithm. You can customize this content based on your needs.
                        </Text>

                        <div className="h-px bg-[#d9d9d9]" />

                        <div className="flex flex-col gap-3.5">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1 lg:gap-2">
                              <Img src="images/vectors/like.svg" alt="Likes" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">1.2K</Text>
                            </div>
                            <div className="flex items-center gap-1 lg:gap-2">
                              <Img src="images/vectors/vers.svg" alt="Search" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">500</Text>
                            </div>
                            <div className="flex items-center gap-1 lg:gap-2">
                              <Img src="images/vectors/revers.svg" alt="Repost" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">300</Text>
                            </div>
                            <Img src="images/vectors/share.svg" alt="Share" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
                      <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-6">
                          <div className="flex items-start justify-between gap-5 md:flex-col">
                            <div className="flex items-center">
                              <div className="w-[32px] lg:w-[64px] rounded-[32px] bg-[#e6e6e699] px-1 py-2">
                                <Img src="images/prompts/nesa.png" alt="Unilag Logo" className="h-auto lg:h-[48px] w-full object-cover" />
                              </div>
                              <div className="flex flex-1 flex-col items-start px-4">
                                <span className="flex items-center gap-1.5 self-stretch w-auto">
                                  <Text as="p" className="text-[14px] font-extrabold md:text-[22px]">For You Post 3</Text>
                                  <Img src="images/vectors/verified.svg" alt="Verified Icon" className="h-[16px] w-[16px]" />
                                </span>
                                <Text as="p" className="mt-[-2px] text-[14px] font-normal text-[#adacb2]">2h</Text>
                              </div>
                            </div>
                          </div>
                          <div className="h-px bg-[#d9d9d9]" />
                        </div>

                        <Text size="body_large_regular" as="p" className="text-[12px] lg:text-[20px] font-normal leading-[30px]">
                          This is a post from someone the algorithm. You can customize this content based on your needs.
                        </Text>

                        <div className="flex w-full bg-[#adacb2] h-[320px] rounded-2xl mx-2">

                        </div>

                        <div className="h-px bg-[#d9d9d9]" />

                        <div className="flex flex-col gap-3.5">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1 lg:gap-2">
                              <Img src="images/vectors/like.svg" alt="Likes" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">1.2K</Text>
                            </div>
                            <div className="flex items-center gap-1 lg:gap-2">
                              <Img src="images/vectors/vers.svg" alt="Search" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">500</Text>
                            </div>
                            <div className="flex items-center gap-1 lg:gap-2">
                              <Img src="images/vectors/revers.svg" alt="Repost" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">300</Text>
                            </div>
                            <Img src="images/vectors/share.svg" alt="Share" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                          </div>
                        </div>
                      </div>
                    </div>

                  </>
                )}
              </div>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${activeTab === 'following' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}
              >
                {activeTab === 'following' && (
                  <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
                    <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
                      <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-6">
                          <div className="flex items-start justify-between gap-5 md:flex-col">
                            <div className="flex items-center">
                              <div className="w-[32px] lg:w-[64px] rounded-[32px] bg-[#e6e6e699] px-1 py-2">
                                <Img src="images/prompts/nesa.png" alt="Unilag Logo" className="h-auto lg:h-[48px] w-full object-cover" />
                              </div>
                              <div className="flex flex-1 flex-col items-start px-4">
                                <span className="flex items-center gap-1.5 self-stretch w-auto">
                                  <Text as="p" className="text-[14px] font-extrabold md:text-[22px]">Following Post 1</Text>
                                  <Img src="images/vectors/verified.svg" alt="Verified Icon" className="h-[16px] w-[16px]" />
                                </span>
                                <Text as="p" className="mt-[-2px] text-[14px] font-normal text-[#adacb2]">2h</Text>
                              </div>
                            </div>
                          </div>
                          <div className="h-px bg-[#d9d9d9]" />
                        </div>

                        <Text size="body_large_regular" as="p" className="text-[12px] lg:text-[20px] font-normal leading-[30px]">
                          This is a post from someone the you follow. You can customize this content based on your needs.
                        </Text>

                        <div className="flex w-full bg-[#adacb2] h-[320px] rounded-2xl mx-1">

                        </div>

                        <div className="h-px bg-[#d9d9d9]" />

                        <div className="flex flex-col gap-3.5">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1 lg:gap-2">
                              <Img src="images/vectors/like.svg" alt="Likes" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">1.2K</Text>
                            </div>
                            <div className="flex items-center gap-1 lg:gap-2">
                              <Img src="images/vectors/vers.svg" alt="Search" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">500</Text>
                            </div>
                            <div className="flex items-center gap-1 lg:gap-2">
                              <Img src="images/vectors/revers.svg" alt="Repost" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">300</Text>
                            </div>
                            <Img src="images/vectors/share.svg" alt="Share" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col max-w-[35%] gap-8 mt-[72px] mb-8 pb-20 h-[100vh] overflow-scroll scrollbar-hide">
          <div className="rounded-[32px] border border-solid border-[#d9d9d9] bg-white">
            <ProfileOrganizationSection />
          </div>
          
          <div className="rounded-[32px] border border-solid h-auto max-h-[60vh] border-[#d9d9d9] bg-white px-[22px] py-5">
            <div className="overflow-hidden h-full">
            <Input
              name="search_seven"
              placeholder="Search Varsigram"
              value={searchBarValue}
              onChange={(e) => setSearchBarValue(e.target.value)}
              prefix={<Img src="images/vectors/search.svg" alt="Search" className="h-[20px] w-[20px]" />}
              suffix={
                searchBarValue?.length > 0 ? <CloseSVG onClick={handleClearSearch} fillColor="gray_800" /> : null
              }
              className="flex h-[48px] items-center rounded-[24px] border-[1.5px] border-[#e6e6e699] pl-[22px] pr-3 text-[14px] text-[#3a3a3a]"
            />

            <Text as="p" className="mt-5 text-[24px] font-medium md:text-[22px]">Who to follow</Text>
            <div className="my-3 flex flex-col gap-5 h-full overflow-auto scrollbar-hide">
              {/* <UserProfile1 />
              <UserProfile1 /> */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-start gap-[7px]">
                    <Text as="p" className="text-[16px] font-normal">
                      Faculty of Arts Student<br />Association
                    </Text>
                    <Img src="images/vectors/verified.svg" alt="Verified" className="h-[16px] w-[16px] mt-0.5" />
                  </div>
                  <Text as="p" className="text-[14px] font-medium text-[#adacb2]">13.8K followers</Text>
                </div>
                <Text as="p" className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white">
                  Follow
                </Text>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-start gap-[7px]">
                    <Text as="p" className="text-[16px] font-normal">
                      Faculty of Arts Student<br />Association
                    </Text>
                    <Img src="images/vectors/verified.svg" alt="Verified" className="h-[16px] w-[16px] mt-0.5" />
                  </div>
                  <Text as="p" className="text-[14px] font-medium text-[#adacb2]">13.8K followers</Text>
                </div>
                <Text as="p" className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white">
                  Follow
                </Text>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-start gap-[7px]">
                    <Text as="p" className="text-[16px] font-normal">
                      Faculty of Arts Student<br />Association
                    </Text>
                    <Img src="images/vectors/verified.svg" alt="Verified" className="h-[16px] w-[16px] mt-0.5" />
                  </div>
                  <Text as="p" className="text-[14px] font-medium text-[#adacb2]">13.8K followers</Text>
                </div>
                <Text as="p" className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white">
                  Follow
                </Text>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-start gap-[7px]">
                    <Text as="p" className="text-[16px] font-normal">
                      Faculty of Arts Student<br />Association
                    </Text>
                    <Img src="images/vectors/verified.svg" alt="Verified" className="h-[16px] w-[16px] mt-0.5" />
                  </div>
                  <Text as="p" className="text-[14px] font-medium text-[#adacb2]">13.8K followers</Text>
                </div>
                <Text as="p" className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white">
                  Follow
                </Text>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-start gap-[7px]">
                    <Text as="p" className="text-[16px] font-normal">
                      Faculty of Arts Student<br />Association
                    </Text>
                    <Img src="images/vectors/verified.svg" alt="Verified" className="h-[16px] w-[16px] mt-0.5" />
                  </div>
                  <Text as="p" className="text-[14px] font-medium text-[#adacb2]">13.8K followers</Text>
                </div>
                <Text as="p" className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white">
                  Follow
                </Text>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-start gap-[7px]">
                    <Text as="p" className="text-[16px] font-normal">
                      Faculty of Arts Student<br />Association
                    </Text>
                    <Img src="images/vectors/verified.svg" alt="Verified" className="h-[16px] w-[16px] mt-0.5" />
                  </div>
                  <Text as="p" className="text-[14px] font-medium text-[#adacb2]">13.8K followers</Text>
                </div>
                <Text as="p" className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white">
                  Follow
                </Text>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <CreateConversation 
        isOpen={isCreateConversationOpen}
        onRequestClose={() => setIsCreateConversationOpen(false)}
      />

      <BottomNav onComplete={onComplete} currentPage="home" />
    </div>
  );
}
