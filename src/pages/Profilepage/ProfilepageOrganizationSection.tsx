import React, { Suspense, useState } from "react";
import { Text } from "../../components/Text";
import { Img } from "../../components/Img";
import { Button } from "../../components/Button/index";
import { Input } from "../../components/Input/index";
import { CloseSVG } from "../../components/Input/close";
import UserProfile from "../../components/UserProfile";
import UserProfile2 from "../../components/UserProfile2";
import "../../styles/style.css"

const deanFollowerList = [
  {
    userTitle: "Dean of Students Affairs",
    verified: "images/vectors/verified.svg",
    userFollowers: "13.8K followers",
  },
  {
    userTitle: "Nigerian Economics Student Association",
    verified: "images/vectors/verified.svg",
    userFollowers: "13.8K followers",
  },
  {
    userTitle: "Mass Communication Student Association",
    verified: "images/vectors/verified.svg",
    userFollowers: "13.8K followers",
  },
  {
    userTitle: "The Project Managers Guild",
    verified: "images/vectors/verified.svg",
    userFollowers: "13.8K followers",
  },
  {
    userTitle: "The Investment Society",
    verified: "images/vectors/verified.svg",
    userFollowers: "13.8K followers",
  },
  {
    userTitle: "Dean of Students Affairs",
    verified: "images/vectors/verified.svg",
    userFollowers: "13.8K followers",
  },
  {
    userTitle: "Nigerian Economics Student Association",
    verified: "images/vectors/verified.svg",
    userFollowers: "13.8K followers",
  },
  {
    userTitle: "Mass Communication Student Association",
    verified: "images/vectors/verified.svg",
    userFollowers: "13.8K followers",
  },
];

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

export default function ProfileOrganizationSection() {
  const [searchBarValue1, setSearchBarValue1] = useState("");

  return (
    <div className="mt-5 py-5 sm:px-5">
      <Input
        name="search_six"
        placeholder="Search"
        value={searchBarValue1}
        onChange={(e) => setSearchBarValue1(e.target.value)}
        prefix={<Img src="images/vectors/search.svg" alt="Search" className="h-[20px] w-[20px]" />}
        suffix={
          searchBarValue1?.length > 0 ? (
            <CloseSVG onClick={() => setSearchBarValue1("")} fillColor="gray_800" />
          ) : null
        }
        className="ml-[2px] mr-1 flex w-full h-[48px] items-start justify-start gap-2.5 rounded-[24px] border-[2px] border-solid border-[#e6e6e699] text-[14px] text-[#3a3a3a]"
      />

      <div className="ml-[22px] mt-6 flex flex-col gap-2 md:ml-0">
        <div className="flex items-start justify-between gap-5">
          <Text as="p" className="mt-1.5 self-end text-[16px] font-medium">Prompts</Text>
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
      </div>

      <div className="ml-5 mt-3 flex flex-col items-start gap-5 md:ml-0">
        <Text as="p" className="text-[24px] font-medium md:text-[22px]">Accounts you follow</Text>
        <div className="mb-2 self-stretch h-[30vh]">
          <div className="mr-[30px] flex flex-col gap-4 h-full md:mr-0 overflow-auto scrollbar-hide">
            <Suspense fallback={<div>Loading feed...</div>}>
              {deanFollowerList.map((d, index) => (
                <UserProfile {...d} key={`listdeanof_${index}`} />
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}