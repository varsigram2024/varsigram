// ENHANCED: Collapsible Sidebar with toggle on logo click

import React, { useState } from "react";
import { Menu, Sidebar, sidebarClasses } from "react-pro-sidebar";
import { Img } from "../Img";
import { Heading } from "../Heading";
import { Text } from "../Text";

interface Props {
  className?: string;
}

export default function Sidebar1({ className = "" }: Props) {
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


        <div className="mt-[45px] flex self-stretch gap-5 px-5 py-4 items-center">
          <Img src="images/home-icon.svg" alt="Home" className="h-[24px] w-[24px]" />
          {!collapsed && (
            <Heading as="p" className="text-[16px] font-semibold">
              Home
            </Heading>
          )}
        </div>

        <div className="flex self-stretch gap-5 px-5 py-[18px] items-center">
          <Img src="images/connections-icon.svg" alt="Contrast" className="h-[24px] w-[24px]" />
          {!collapsed && <Text as="p" className="text-[16px] font-semibold">Connections</Text>}
        </div>

        <div className="flex self-stretch gap-5 px-5 py-[18px] items-center">
          <Img src="images/chat-icon.svg" alt="Contrast" className="h-[24px] w-[24px]" />
          {!collapsed && <Text as="p" className="text-[16px] font-semibold">Chats</Text>}
        </div>

        <div className="flex self-stretch gap-5 px-5 py-[18px] items-center">
          <Img src="images/resources-icon.svg" alt="Library" className="h-[24px] w-[24px]" />
          {!collapsed && <Text as="p" className="text-[16px] font-semibold">Resources</Text>}
        </div>

        <div className="flex self-stretch gap-5 px-5 py-[18px] items-center">
          <Img src="images/marketplace-icon.svg" alt="File" className="h-[24px] w-[24px]" />
          {!collapsed && <Text as="p" className="text-[16px] font-semibold">Marketplace</Text>}
        </div>





        
        <div className="flex self-stretch gap-5 px-5 py-[18px] mt-[20vh] items-center">
          <Img src="images/settings-icon.svg" alt="File" className="h-[24px] w-[24px]" />
          {!collapsed && <Text as="p" className="text-[16px] font-semibold">Settings</Text>}
        </div>

        <div className="flex self-stretch gap-5 px-5 py-[18px] items-center ">
          <Img src="images/user-image.png" alt="File" className="h-[32px] w-[32px] rounded-[50%]" />
          {!collapsed && <Text as="p" className="text-[16px] font-semibold">Meiyaku</Text>}
        </div>

      </div>
    </Sidebar>
  );
}
