import React, { useState } from "react";

import { Text } from "../../components/Text/index.tsx";
import { Img } from "../../components/Img/index.tsx";
import { Input } from "../../components/Input/index.tsx";
import { Heading } from "../../components/Heading/index.tsx";
import { CloseSVG } from "../../components/Input/close.tsx";
import Sidebar1 from "../../components/Sidebar1/index.tsx";
import UserProfile1 from "../../components/UserProfile1/index.tsx";
import ProfileOrganizationSection from "./ProfilepageOrganizationSection.tsx";
import BottomNav from "../../components/BottomNav/index.tsx";

// Add interface for props
interface ProfilepageOrganizationProps {
  onComplete: (page: string) => void;
}

// Update component to accept props
export default function ProfilepageOrganizationPage({ onComplete }: ProfilepageOrganizationProps) {
  const [searchBarValue, setSearchBarValue] = useState("");

  const handleClearSearch = () => setSearchBarValue("");

  return (
   

      <div className="flex w-full items-start justify-center bg-white">
        <Sidebar1 onComplete={onComplete} currentPage="user-profile" />

        <div className="flex w-full lg:w-[85%] items-start justify-center h-auto flex-row">
          <div className="lg:mt-[72px] w-full flex lg:flex-1 flex-col lg:h-[100vh] max-h-full items-center lg:items-end md:gap-[70px] lg:overflow-auto scrollbar-hide sm:gap-[52px] px-0 md:px-5 gap-[35px]">
            {/* Cover photo section */}
            <div className="flex w-[92%] justify-end rounded-[20px] pb-2 bg-[#f6f6f6] md:w-full">
              <div className="flex w-full flex-col self-stretch gap-2.5">
                <div className="flex flex-col items-center justify-center gap-2 rounded-tl-[20px] rounded-tr-[20px] bg-[#750015] p-10 sm:p-5">
                  <Img src="images/cover-photo-bg.svg" alt="Add Cover" className="h-[60px] w-[60px]" />
                  <Text as="h4" className="text-[28px] font-semibold text-white md:text-[26px] sm:text-[24px]">
                    Add a Cover Photo
                  </Text>
                </div>
                <div className="relative ml-4 mt-[-46px] w-[120px] h-[120px] rounded-[50%] border-[5px] border-[#ffdbe2] bg-white py-2.5">
                  <Img src="images/unilag-logo.png" alt="Unilag Logo" className="h-[90px] w-full object-cover md:h-auto" />
                </div>

                {/* University name and stats */}
                <div className="mx-3.5 ml-4 flex flex-col items-start gap-4">
                  <div className="flex items-center gap-[7px]">
                    <Heading size="h3_semibold" as="h1" className="text-[28px] font-semibold md:text-[26px] sm:text-[24px]">
                      University of Lagos
                    </Heading>
                    <Img src="images/vectors/verified.svg" alt="Verified" className="h-[20px] w-[20px]" />
                  </div>
                  <Text as="p" className="text-[16px] font-normal">
                    The University of First Choice and Nation's Pride
                  </Text>
                  <div className="flex flex-wrap gap-6">
                    <Text as="p" className="text-[16px] font-normal">
                      <span className="font-semibold">18.6K</span> Followers
                    </Text>
                    <Text as="p" className="text-[16px] font-normal">16 Following</Text>
                  </div>
                  <Text as="p" className="text-[12px] font-normal text-black">
                    Followed by Mahmud and 1,000 others
                  </Text>
                </div>
              </div>
              <div className="h-px bg-[#d9d9d9]" />
            </div>

            {/* Post Section 1*/}
            <div className="flex w-[90%] flex-col items-center md:w-full mb-6">
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-6">
                
                  <div className="flex items-start justify-between gap-5 md:flex-col">
                    <div className="flex items-center">
                      <div className="w-[64px] rounded-[32px] bg-[#e6e6e699] px-1 py-2">
                        <Img src="images/unilag-logo.png" alt="Unilag Logo" className="h-[48px] w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col items-start px-4">
                        <span className="flex items-center gap-1.5 self-stretch w-auto">
                        <Text as="p" className="text-[24px] font-medium md:text-[22px]">University of Lagos</Text>
                        <Img src="images/vectors/verified.svg" alt="Verified Icon" className="h-[16px] w-[16px]" />
                        </span>
                        <Text as="p" className="mt-[-2px] text-[16px] font-normal text-[#adacb2]">Just now</Text>
                      </div>
                    </div>
                    {/* <div className="flex items-start">
                      {[1, 2, 3].map((_, i) => (
                        <Img key={i} src="images/vectors/verified.svg" alt="Vector" className="h-[3px] w-[3px] ml-[-2px]" />
                      ))}
                    </div> */}
                  </div>
                  <div className="h-px bg-[#d9d9d9]" />
                </div>

                <Text size="body_large_regular" as="p" className="text-[20px] font-normal leading-[30px]">
                The University management has decided to improve and renovate it's hostels, ensuring comfortability of all students. The University has decided to improve and renovate it's hostels, ensuring comfortability of all students.
                </Text>

                <div className="h-px bg-[#d9d9d9]" />

                <div className="flex flex-col gap-3.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/like.svg" alt="Likes" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">14.6K</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/vers.svg" alt="Search" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">2.1K</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/revers.svg" alt="Repost" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">3K</Text>
                    </div>
                    <Img src="images/vectors/share.svg" alt="Share" className="h-[32px] w-[32px]" />
                  </div>
                </div>
              </div>

            </div>



           {/* Post Section 1*/}
           <div className="flex w-[90%] flex-col items-center md:w-full mb-6">
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-6">
                
                  <div className="flex items-start justify-between gap-5 md:flex-col">
                    <div className="flex items-center">
                      <div className="w-[64px] rounded-[32px] bg-[#e6e6e699] px-1 py-2">
                        <Img src="images/unilag-logo.png" alt="Unilag Logo" className="h-[48px] w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col items-start px-4">
                        <span className="flex items-center gap-1.5 self-stretch w-auto">
                        <Text as="p" className="text-[24px] font-medium md:text-[22px]">University of Lagos</Text>
                        <Img src="images/vectors/verified.svg" alt="Verified Icon" className="h-[16px] w-[16px]" />
                        </span>
                        <Text as="p" className="mt-[-2px] text-[16px] font-normal text-[#adacb2]">Just now</Text>
                      </div>
                    </div>
                    {/* <div className="flex items-start">
                      {[1, 2, 3].map((_, i) => (
                        <Img key={i} src="images/vectors/verified.svg" alt="Vector" className="h-[3px] w-[3px] ml-[-2px]" />
                      ))}
                    </div> */}
                  </div>
                  <div className="h-px bg-[#d9d9d9]" />
                </div>

                <Text size="body_large_regular" as="p" className="text-[20px] font-normal leading-[30px]">
                The University management has decided to improve and renovate it's hostels, ensuring comfortability of all students. The University has decided to improve and renovate it's hostels, ensuring comfortability of all students.
                </Text>

                <div className="h-px bg-[#d9d9d9]" />

                <div className="flex flex-col gap-3.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/like.svg" alt="Likes" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">14.6K</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/vers.svg" alt="Search" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">2.1K</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/revers.svg" alt="Repost" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">3K</Text>
                    </div>
                    <Img src="images/vectors/share.svg" alt="Share" className="h-[32px] w-[32px]" />
                  </div>
                </div>
              </div>

            </div>




            {/* Post Section 1*/}
            <div className="flex w-[90%] flex-col items-center md:w-full mb-6">
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-6">
                
                  <div className="flex items-start justify-between gap-5 md:flex-col">
                    <div className="flex items-center">
                      <div className="w-[64px] rounded-[32px] bg-[#e6e6e699] px-1 py-2">
                        <Img src="images/unilag-logo.png" alt="Unilag Logo" className="h-[48px] w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col items-start px-4">
                        <span className="flex items-center gap-1.5 self-stretch w-auto">
                        <Text as="p" className="text-[24px] font-medium md:text-[22px]">University of Lagos</Text>
                        <Img src="images/vectors/verified.svg" alt="Verified Icon" className="h-[16px] w-[16px]" />
                        </span>
                        <Text as="p" className="mt-[-2px] text-[16px] font-normal text-[#adacb2]">Just now</Text>
                      </div>
                    </div>
                    {/* <div className="flex items-start">
                      {[1, 2, 3].map((_, i) => (
                        <Img key={i} src="images/vectors/verified.svg" alt="Vector" className="h-[3px] w-[3px] ml-[-2px]" />
                      ))}
                    </div> */}
                  </div>
                  <div className="h-px bg-[#d9d9d9]" />
                </div>

                <Text size="body_large_regular" as="p" className="text-[20px] font-normal leading-[30px]">
                The University management has decided to improve and renovate it's hostels, ensuring comfortability of all students. The University has decided to improve and renovate it's hostels, ensuring comfortability of all students.
                </Text>

                <div className="h-px bg-[#d9d9d9]" />

                <div className="flex flex-col gap-3.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/like.svg" alt="Likes" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">14.6K</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/vers.svg" alt="Search" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">2.1K</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/revers.svg" alt="Repost" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">3K</Text>
                    </div>
                    <Img src="images/vectors/share.svg" alt="Share" className="h-[32px] w-[32px]" />
                  </div>
                </div>
              </div>

            </div>






            {/* Post Section 1*/}
            <div className="flex w-[90%] flex-col items-center md:w-full mb-6">
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-6">
                
                  <div className="flex items-start justify-between gap-5 md:flex-col">
                    <div className="flex items-center">
                      <div className="w-[64px] rounded-[32px] bg-[#e6e6e699] px-1 py-2">
                        <Img src="images/unilag-logo.png" alt="Unilag Logo" className="h-[48px] w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col items-start px-4">
                        <span className="flex items-center gap-1.5 self-stretch w-auto">
                        <Text as="p" className="text-[24px] font-medium md:text-[22px]">University of Lagos</Text>
                        <Img src="images/vectors/verified.svg" alt="Verified Icon" className="h-[16px] w-[16px]" />
                        </span>
                        <Text as="p" className="mt-[-2px] text-[16px] font-normal text-[#adacb2]">Just now</Text>
                      </div>
                    </div>
                    {/* <div className="flex items-start">
                      {[1, 2, 3].map((_, i) => (
                        <Img key={i} src="images/vectors/verified.svg" alt="Vector" className="h-[3px] w-[3px] ml-[-2px]" />
                      ))}
                    </div> */}
                  </div>
                  <div className="h-px bg-[#d9d9d9]" />
                </div>

                <Text size="body_large_regular" as="p" className="text-[20px] font-normal leading-[30px]">
                The University management has decided to improve and renovate it's hostels, ensuring comfortability of all students. The University has decided to improve and renovate it's hostels, ensuring comfortability of all students.
                </Text>

                <div className="h-px bg-[#d9d9d9]" />

                <div className="flex flex-col gap-3.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/like.svg" alt="Likes" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">14.6K</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/vers.svg" alt="Search" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">2.1K</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/revers.svg" alt="Repost" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">3K</Text>
                    </div>
                    <Img src="images/vectors/share.svg" alt="Share" className="h-[32px] w-[32px]" />
                  </div>
                </div>
              </div>

            </div>






            {/* Post Section 1*/}
            <div className="flex w-[90%] flex-col items-center md:w-full mb-6">
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-6">
                
                  <div className="flex items-start justify-between gap-5 md:flex-col">
                    <div className="flex items-center">
                      <div className="w-[64px] rounded-[32px] bg-[#e6e6e699] px-1 py-2">
                        <Img src="images/unilag-logo.png" alt="Unilag Logo" className="h-[48px] w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col items-start px-4">
                        <span className="flex items-center gap-1.5 self-stretch w-auto">
                        <Text as="p" className="text-[24px] font-medium md:text-[22px]">University of Lagos</Text>
                        <Img src="images/vectors/verified.svg" alt="Verified Icon" className="h-[16px] w-[16px]" />
                        </span>
                        <Text as="p" className="mt-[-2px] text-[16px] font-normal text-[#adacb2]">Just now</Text>
                      </div>
                    </div>
                    {/* <div className="flex items-start">
                      {[1, 2, 3].map((_, i) => (
                        <Img key={i} src="images/vectors/verified.svg" alt="Vector" className="h-[3px] w-[3px] ml-[-2px]" />
                      ))}
                    </div> */}
                  </div>
                  <div className="h-px bg-[#d9d9d9]" />
                </div>

                <Text size="body_large_regular" as="p" className="text-[20px] font-normal leading-[30px]">
                The University management has decided to improve and renovate it's hostels, ensuring comfortability of all students. The University has decided to improve and renovate it's hostels, ensuring comfortability of all students.
                </Text>

                <div className="h-px bg-[#d9d9d9]" />

                <div className="flex flex-col gap-3.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/like.svg" alt="Likes" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">14.6K</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/vers.svg" alt="Search" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">2.1K</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Img src="images/vectors/revers.svg" alt="Repost" className="h-[32px] w-[32px]" />
                      <Text as="p" className="text-[14px] font-normal">3K</Text>
                    </div>
                    <Img src="images/vectors/share.svg" alt="Share" className="h-[32px] w-[32px]" />
                  </div>
                </div>
              </div>

            </div>



            


          </div>

           {/* Profile Side Panel */}
           <div className="hidden lg:flex flex-col max-w-[35%] gap-8 mt-[72px] mb-8">
                <div className="rounded-[32px] border border-solid border-[#d9d9d9] bg-white">
                  <ProfileOrganizationSection />
                </div>
                <div className="rounded-[32px] border border-solid overflow-hidden h-[60vh] border-[#d9d9d9] bg-white px-[22px] py-5">
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

        <BottomNav onComplete={onComplete} currentPage="user-profile" />
      </div>
  );
}
