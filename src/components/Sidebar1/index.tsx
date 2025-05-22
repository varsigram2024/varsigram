// ENHANCED: Collapsible Sidebar with toggle on logo click

import React, { useState } from "react";
import { Menu, Sidebar, sidebarClasses } from "react-pro-sidebar";
import { Img } from "../Img";
import { Heading } from "../Heading";
import { Text } from "../Text";

interface Props {
  onComplete?: (page: string) => void;
  currentPage?: string;
  className?: string;
}

export default function Sidebar1({ onComplete, currentPage, className = "" }: Props) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Sidebar
      collapsed={collapsed}
      width="250px"
      collapsedWidth="90px"
      className={`${className} hidden lg:flex h-[100vh] flex-col overflow-auto border-solid border-[#adacb2] bg-white pt-1 !sticky top-0`}
    >
      <div className="flex h-full flex-col px-0 items-center">
        <div className="mt-[5px] flex self-stretch gap-5 px-1 py-[18px] items-center">
          <button onClick={() => setCollapsed((prev) => !prev)} className="focus:outline-none">
            <Img
              src={collapsed ? "/images/vasigram-logo.png" : "/images/vasigram-logo.png"}
              alt="Sidebarlogo"
              className="h-[44px] w-[64px] object-contain"
            />
          </button>
        </div>


        <div 
        onClick={() => {
          console.log('Home clicked, calling onComplete with "home"');
          onComplete?.('home');
        }}
        className="mt-[45px] flex self-stretch gap-5 px-5 py-4 items-center">
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={currentPage === 'home' ? 'text-[#750015]' : 'text-gray-600'}>
            <path d="M7.08848 5.22458L6.08847 6.00547C4.57182 7.18981 3.81348 7.78199 3.40674 8.61695C3 9.45191 3 10.4165 3 12.3455V14.4376C3 18.2239 3 20.1171 4.17157 21.2934C5.11466 22.2402 6.52043 22.4249 9 22.4609V18.4666C9 17.5347 9 17.0687 9.15224 16.7012C9.35523 16.2111 9.74458 15.8218 10.2346 15.6188C10.6022 15.4666 11.0681 15.4666 12 15.4666C12.9319 15.4666 13.3978 15.4666 13.7654 15.6188C14.2554 15.8218 14.6448 16.2111 14.8478 16.7012C15 17.0687 15 17.5347 15 18.4666V22.4609C17.4796 22.4249 18.8853 22.2402 19.8284 21.2934C21 20.1171 21 18.2239 21 14.4376V12.3455C21 10.4165 21 9.45191 20.5933 8.61695C20.1865 7.78199 19.4282 7.18981 17.9115 6.00547L16.9115 5.22458C14.5521 3.38215 13.3724 2.46094 12 2.46094C10.6276 2.46094 9.44787 3.38215 7.08848 5.22458Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          {!collapsed && (
            <Heading as="p" className={currentPage === 'home' ? 'text-[#750015]' : 'text-gray-600'}>
              Home
            </Heading>
          )}
        </div>



        <div className="flex self-stretch gap-5 px-5 py-[18px] items-center">
          <Img src="images/connections-icon.svg" alt="Contrast" className="h-[24px] w-[24px]" />
          {!collapsed && <Text as="p" className="text-[16px] font-semibold">Connections</Text>}
        </div>



        <div 
        onClick={() => {
          console.log('Chat clicked, calling onComplete with "home"');
          onComplete?.('chat');
        }}
        className="flex self-stretch gap-5 px-5 py-4 items-center">
         <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={currentPage === 'chat' ? 'text-[#750015]' : 'text-gray-600'}>
          <path d="M22 12.1526C22 17.4358 17.5222 21.7193 12 21.7193C11.3507 21.7202 10.7032 21.6601 10.0654 21.5404C9.60633 21.4541 9.37678 21.411 9.21653 21.4355C9.05627 21.46 8.82918 21.5807 8.37499 21.8223C7.09014 22.5056 5.59195 22.7469 4.15111 22.4789C4.69874 21.8053 5.07275 20.9971 5.23778 20.1307C5.33778 19.6007 5.09 19.0859 4.71889 18.709C3.03333 16.9974 2 14.691 2 12.1526C2 6.86951 6.47778 2.58594 12 2.58594C17.5222 2.58594 22 6.86951 22 12.1526Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>

          {!collapsed && <Heading as="p" className={currentPage === 'chat' ? 'text-[#750015]' : 'text-gray-600'}>
              Chats
            </Heading>}
        </div>





        <div className="flex self-stretch gap-5 px-5 py-[18px] items-center">
          <Img src="images/resources-icon.svg" alt="Library" className="h-[24px] w-[24px]" />
          {!collapsed && <Text as="p" className="text-[16px] font-semibold">Resources</Text>}
        </div>

        <div className="flex self-stretch gap-5 px-5 py-[18px] items-center">
          <Img src="images/marketplace-icon.svg" alt="File" className="h-[24px] w-[24px]" />
          {!collapsed && <Text as="p" className="text-[16px] font-semibold">Marketplace</Text>}
        </div>





        
        <div    
        className="flex self-stretch gap-5 px-5 py-[18px] mt-[20vh] items-center">
          <Img src="images/settings-icon.svg" alt="File" className="h-[24px] w-[24px]" />
          {!collapsed && <Text as="p" className="text-[16px] font-semibold">Settings</Text>}
        </div>

        <div 
        onClick={() => onComplete?.('user-profile')}     
        className="flex self-stretch gap-5 px-5 py-[18px] items-center ">
          <Img src="images/user-image.png" alt="File" className="h-[32px] w-[32px] rounded-[50%]" />
          {!collapsed && <Text as="p" className={currentPage === 'user-profile' ? 'text-[#750015]' : 'text-black'}>Meiyaku</Text>}
        </div>

      </div>
    </Sidebar>
  );
}
