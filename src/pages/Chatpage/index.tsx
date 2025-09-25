import React, { Suspense, ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchInput } from "../../components/Input/SearchInput.tsx";
import { Text } from "../../components/Text/index.tsx";
import { Img } from "../../components/Img/index.tsx";
import { Input } from "../../components/Input/index.tsx";
import { Heading } from "../../components/Heading/index.tsx";
import { CloseSVG } from "../../components/Input/close.tsx";
import Sidebar1 from "../../components/Sidebar1/index.tsx";
import UserProfile1 from "../../components/UserProfile1/index.tsx";
import ProfileOrganizationSection from "../Profilepage/ProfilepageOrganizationSection.tsx";
import { Button } from "../../components/Button/index";
import UserProfile2 from "../../components/UserProfile2";
import BottomNav from "../../components/BottomNav";



interface ChatpageProps {
  // onComplete: (page: string) => void;
}


const userProfileList = [
    {
      userImage: "images/user-image.png",
      userStatus: "",
      userIcon: "",
      userName: "ME"
    },
    {
      userImage: "images/unilag-logo.png",
      userStatus: "2",
      userIcon: "images/vectors/verified.svg",
      userName: "UNILAG"
    },
    {
      userImage: "images/prompts/nesa.png",
      userStatus: "7",
      userIcon: "images/vectors/verified.svg",
      userName: "NESA"
    },
    {
      userImage: "images/prompts/mssn.png",
      userStatus: "2",
      userIcon: "images/vectors/verified.svg",
      userName: "MSSN"
    },
    {
      userImage: "images/prompts/medical.png",
      userStatus: "7",
      userIcon: "images/vectors/verified.svg",
      userName: "Medical"
    },
    {
      userImage: "images/prompts/fessa.png",
      userStatus: "4",
      userIcon: "images/vectors/verified.svg",
      userName: "FESSA"
    },
    {
      userImage: "images/unilag-logo.png",
      userStatus: "2",
      userIcon: "images/vectors/verified.svg",
      userName: "DSA"
    },
    
  ];



export default function Chatpage() {
  const navigate = useNavigate();
  const [searchBarValue, setSearchBarValue] = useState("");
  const [searchBarValue6, setSearchBarValue6] = useState("");
  const [searchBarValue7, setSearchBarValue7] = useState("");
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [isCreateConversationOpen, setIsCreateConversationOpen] = useState(false);
  const [conversationText, setConversationText] = useState("");

  const handleClearSearch = () => setSearchBarValue("");

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative">
      

      <div className="flex flex-row-reverse w-full lg:w-[105%] items-start justify-center h-auto">
        <div className="hidden lg:flex mt-[38px] lg:mt-[0px] flex-1 items-center justify-center gap-[4px] md:flex-col md:self-stretch p-5"> 
          <Text as="h2" className="text-left w-[30%] text-[24px] font-extrabold">
            No Messages Yet
          </Text>
          <Text as="p" className="text-left text-[14px] font-medium w-[30%]">Stay tuned! The chat feature is on its way to make campus connections even easier.</Text>
          <div className="text-left w-[30%]">
          <Button variant="outline" color="gray_400_01" size="2x1" className="mt-4 bg-[#750015] rounded-3xl p-4 text-white">
            New Message
          </Button>
        </div>
          </div>

        <div className="flex flex-col max-w-full lg:max-w-[35%] gap-8">
            <div className="mt-[38px] lg:mt-[0px] flex flex-1 items-center justify-center gap-[45px] md:flex-col md:self-stretch"> 
            <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col lg:h-[100vh] max-h-full md:gap-[15px] lg:overflow-auto scrollbar-hide sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
                <div className="flex items-center gap-2.5 mb-8">
                <div 
                    onClick={() => handleNavigation('user-profile')} 
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                    <Text as="p" className="text-[24px] font-medium md:text-[22px]">
                    <b>Chats</b>
                    </Text>
                </div>
                </div>
                
                <Input
                name="search_seven"
                placeholder="Search Messages"
                value={searchBarValue}
                onChange={(e) => setSearchBarValue(e.target.value)}
                prefix={<Img src="images/vectors/search.svg" alt="Search" className="h-[20px] w-[20px]" />}
                suffix={
                    searchBarValue?.length > 0 ? <CloseSVG onClick={handleClearSearch} fillColor="gray_800" /> : null
                }
                className="flex h-[48px] items-center rounded-[24px] border-[1.5px] bg-white border-[#e6e6e699] pl-[22px] pr-3 text-[14px] text-[#3a3a3a]"
                />
            
                {/* <div className="ml-[22px] flex flex-col gap-2 md:ml-0">

                    <div className="flex items-start justify-between gap-5">
                    <Text as="p" className="self-end text-[16px] font-bold">Prompts</Text>
                    <div className="mr-[34px] border-b border-solid border-[#750015]">
                        <a href="#">
                        <Text size="textlg" as="p" className="text-[12px] font-normal">View all</Text>
                        </a>
                    </div>
                    </div>

                    <div className="flex items-start sm:flex-col w-full overflow-auto scrollbar-hide">
                    <div className="flex flex-1 items-start justify-center gap-3 sm:flex-row">
                    <Button size="2x1" variant="fill" color="pink_100" shape="circle" className="w-[52px] rounded-[24px] px-3.5">
                        <Img src="images/vectors/search.svg" alt="SearchIcon" />
                        </Button>
                        <div className="ml-3 flex flex-1 gap-3 md:flex-row sm:ml-0">
                        <Suspense fallback={<div>Loading feed...</div>}>
                            {userProfileList.map((d, index) => (
                            <UserProfile2 {...d} key={`listgroup_${index}`} className="w-[54px]" />
                            ))}
                        </Suspense>
                        </div>
                    </div>

                    </div>

                </div> */}

                <div className="ml-[22px] flex flex-col gap-2 md:ml-0">

                    <div className="flex items-start justify-between gap-5">
                    <Text as="p" className="self-end text-[16px] font-extrabold">Messages</Text>
                    <div className="mr-[34px] border-b border-solid border-[#750015]">
                      
                    </div>
                    </div>

                </div>


                <div className="ml-[22px] flex flex-col items-center justify-center p-4 gap-2 md:ml-0 h-[400px]">

                    <div className="flex flex-col items-center h-full justify-center gap-5">
                    <Text as="p" className="text-left self-start text-[24px] font-extrabold">Chat Coming Soon!</Text>
                    <Text as="p" className="text-left self-start text-[14px] font-medium">Stay tuned! The chat feature is on its way to make campus connections even easier.</Text>
                    
                    </div>

                </div>

                
            </div>
            </div>

        </div>

      </div>

      {/* <BottomNav /> */}
    </div>
  );
}