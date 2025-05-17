import { Text, Img, Heading, Button } from "../../../components";
import { SearchInput } from "../../../components/Input/SearchInput";
import Common from "../../../components/Common";
import Common2 from "../../../components/Common3";
import Common4 from "../../../components/Common5";
import { CloseSVG } from "../../../components/Input/close";
import React, { Suspense, ChangeEvent } from "react";


const data = [
  { deanof: "Dean of Students Affairs", p138kfollowers: "13.8K followers" },
  { deanof: "Mass Communication Student Association", p138kfollowers: "13.8K followers" },
  {
    deanof: (
      <>
        Faculty of Arts Student<br />Association
      </>
    ),
    p138kfollowers: "13.8K followers",
  },
  { deanof: "The Project Managers Guild", p138kfollowers: "13.8K followers" },
  { deanof: "The Investment Society", p138kfollowers: "13.8K followers" },
  { deanof: "AIESEC In Lagos", p138kfollowers: "13.8K followers" },
];

const data1 = [
  { deanof: "Dean of Students Affairs", p138kfollowers: "13.8K followers" },
  { deanof: "Nigerian Economics Student Association", p138kfollowers: "13.8K followers" },
  { deanof: "Mass Communication Student Association", p138kfollowers: "13.8K followers" },
  { deanof: "The Project Managers Guild", p138kfollowers: "13.8K followers" },
  { deanof: "The Investment Society", p138kfollowers: "13.8K followers" },
];


export default function Post() {
  const [searchBarValue6, setSearchBarValue6] = React.useState("");
  const [searchBarValue7, setSearchBarValue7] = React.useState("");
return (

    <div className="flex w-full justify-center bg-[#f6f6f6]">
        <div className="container-xs flex items-start justify-center md:flex-col md:px-5">
            <div className="flex w-[6%] flex-col gap-[826px] overflow-x-scroll border-r border-solid border-[#adacb2] bg-[#ffffff] px-3 py-5 md:w-full md:gap-[619px] sm:gap-[413px]">
                <div className="mt-4 flex flex-col gap-[70px] md:gap-[52px] sm:gap-[35px]">
                    <Img src="images/img_user_pink_900_44x64.svg" alt="User" className="h-[44px]" />
                    <div className="flex flex-col items-center">
                        <div className="flex gap-5 self-stretch px-5 py-4">
                            <Img src="images/img_home_pink_900_24x24.svg" alt="Homeone" className="h-[24px] w-[24px]" />
                            <Heading as="h1" className="text-[16px] font-semibold">
                                Home
                            </Heading>
                        </div>
                        <div className="flex gap-5 p-[18px]">
                            <Img src="images/img_lock.svg" alt="Lock" className="h-[24px] w-[24px]" />
                            <Heading as="h2" className="text-[16px] font-semibold"> Connections
                            </Heading>
                        </div>
                        <div className="flex gap-5 self-stretch px-5 py-[18px]">
                            <img src="images/img_contrast.svg" alt="Contrastone" className="h-[24px] w-[24px]" /> 
                            <Heading as="h3" className="text-[16px] font-semibold">
                                Chats
                            </Heading>
                        </div>
                        <div className="flex justify-center gap-5 self-stretch p-[18px]">
                            <Img src="images/img_library.svg" alt="Library" className="h-[24px] w-[24px]" /> 
                            <Heading as="h4" className="text-[16px] font-semibold">
                                Resources
                            </Heading>
                        </div>
                        <div className="flex gap-5 p-[18px]">
                            <Img src="images/img_file.svg" alt="File" className="h-[24px] w-[24px]" />
                            <Heading as="h5" className="text-[16px] font-semibold">
                                Marketplace
                            </Heading>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <Img src="images/img_search.svg" alt="Search" className="h-[58px]" />
                <Img src="images/img_thumbs_up.png" alt="Thumbsup" className="h-[44px] object-cover" /> 
            </div>

            
            <div className="mt-[38px] flex flex-1 items-center justify-center gap-[45px] md:flex-col md: self-stretch"> <div className="w-[56%] md:w-full">
                <div className="flex items-center gap-2.5">
                    <Text as="p" className="text-[24px] font-medium md:text-[22px]">
                        Welcome back, Mahmud
                    </Text>
                    <img src="images/img_user_blue_300.svg" alt="User" className="h-[20px] w-[20px]" />
                </div>
                <div className="mt-12 flex justify-center">
                    <div className="flex flex-1 px-3">
                        <Text as="p" className="text-[24px] font-medium !text-[#adacb2] md:text-[22px]"> For you
                        </Text>
                    </div>
                    <div className="flex border-b border-solid border-[#750015] px-1.5">
                        <Text as="p" className="text-[24px] font-medium md:text-[22px]"> Following
                        </Text>
                    </div>
                </div>
                <div className="mt-8 flex justify-center rounded-[28px] bg-[#ffffff] p-3">
                    <Text size="body_large_regular" as="p" className="self-end text-[20px] font-normal !text-[#adacb2]"> Create a conversation
                    </Text>
                    <div className="flex flex-1 justify-end gap-6 px-1.5">
                        <Img src="images/img_image.svg" alt="Image" className="h-[24px] w-[24px]" />
                        <Img src="images/img_camera_gray_400.svg" alt="Camera" className="h-[24px] w-[24px]" />
                        <Img src="images/img_upload.svg" alt="Upload" className="h-[24px] w-[24px]" />
                    </div>
                </div>
                <div className="mt-10 flex flex-col gap-8">
                    
                </div>
                <div className="ml-3 mt-8 flex flex-col items-center gap-7 rounded-[24px] bg-[#ffffff] px-3 py-4 md:ml-0">
                    <div className="flex flex-col gap-6 self-stretch">
                        <div className="flex flex-col md:flex-row items-start">
                            <div className="flex-1 self-center md:self-stretch">
                                <div className="flex items-center gap-4">
                                    <Img
                                        src="images/img_ellipse_1544_64x64.png"
                                        alt="Image"
                                        className="h-[64px] w-[64px] rounded-[32px] object-cover"
                                    />
                                    <div className="flex flex-1 flex-col items-start justify-center">
                                        <Text as="p" className="text-[28px] font-medium md:text-[26px] sm:text-[24px]"> Yusuf Lawal
                                        </Text>
                                        <Text as="p" className="text-[16px] font-normal !text-[#adacb2]">
                                        5 hours ago
                                        </Text>
                                    </div>
                                </div>
                            </div>
                            <Img
                                src="images/img_more_vertical_gray_400.svg"
                                alt="Morevertical"
                                className="h-[36px] w-[36px] md:w-full"
                            />
                        </div>
                        <div className="h-px bg-[#d9d9d9]" />
                    </div>
                    <Text size="body_large_regular" as="p" className="text-[20px] font-normal">
                    Guys, check out my new design portfolio! Took a lot of hard work and dedication to get this far. Reach out to me if you need a designer on your project.
                    </Text>
                </div>
                </div>
                <div className="flex w-[38%] flex-col gap-8 md:w-full">
                    <div className="rounded-[32px] border border-solid border-[#bebebe]">
                        <SearchInput
                            size={2}
                            name="search_four"
                            placeholder="Search"
                            value={searchBarValue7}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchBarValue7(e.target.value)}
                            prefix={
                              <span className="shrink-0">
                                <Img
                                  src="images/img_search_gray_800.svg"
                                  alt="Search"
                                  className="h-[18px] w-[20px] object-contain"
                                />
                              </span>
                            }
                            suffix={searchBarValue7?.length > 0 ? (
                              <CloseSVG onClick={() => setSearchBarValue7("")} height={18} fillColor="gray_800" />
                            ) : null}
                            className="ml-[22px] mr-6 mt-5 gap-2.5 rounded-[24px] !border-[1.5px] md:mx-0"
                        />
                        <div className="ml-[22px] mt-6 flex flex-col gap-2 md:m1-0">
                            <div className="flex items-start justify-between gap-5">
                                <Text as="p" className="mt-1.5 self-end text-[16px] font-medium">Prompts</Text>
                                <div className="mr-[34px] flex border-b border-solid border-[#750015]">
                                    <a href="#">
                                        <Text size="textlg" className="text-[12px] font-normal">View all</Text>
                                    </a>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-start justify-center sm:flex-col">
                                    <Button className="flex h-[48px] w-[48px] items-center justify-center rounded-[24px] bg-[#eacade] px-3.5">
                                        <Img src="images/img_search_pink_300.svg" />
                                    </Button>
                                    <div className="flex-1 px-1 sm:self-stretch">
                                        <div className="flex flex-col items-end gap-0.5">
                                            <div className="ml-1.5 self-stretch rounded-[26px] border border-solid border-[#ff6682] md:m1-0">
                                                <div className="flex items-center justify-center">
                                                    <div className="relative z-[1] h-[48px] flex-1 rounded-[24px] bg-[#5b5b5b]">
                                                        <Img src="images/img_ellipse_11.png" alt="Image" className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[48px] w-full rounded-[24px] object-cover" />
                                                        <Heading size="headingsm" as="h2" className="absolute right-[-3px] top-[-1.79px] m-auto h-[10px] w-[10px] rounded-[5px] bg-[#ff6682] text-[8px] font-semibold !text-[#ffffff]">2</Heading>
                                                    </div>
                                                    <div className="relative ml-[-10px] flex h-[14px] items-center self-end bg-[url(/public/images/defaultNoData.png)] bg-cover bg-no-repeat p-1 md:h-auto">
                                                        <Img src="images/img_vector_white.svg" alt="Vector" className="h-[4px] w-[6px]" />
                                                    </div>
                                                </div>
                                            </div>
                                            <Text as="p" className="mr-2.5 text-[12px] font-normal md:mr-0">NESA</Text>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col items-center gap-0.5 sm:self-stretch">
                                    <div className="relative h-[54px] self-stretch rounded-[26px] border border-solid border-[#ff6682]">
                                        <div className="absolute bottom-0 right-[-0.25px] top-0 my-auto flex h-max w-[28%] flex-col items-start gap-5">
                                            <div className="flex h-[10px] w-[10px] flex-col items-center justify-center rounded-[5px] bg-[#ff6682] md:h-auto">
                                                <Heading size="headingsm" as="h3" className="text-[8px] font-semibold !text-[#ffffff]">2</Heading>
                                            </div>
                                            <Img src="images/img_verified_symbol_icon.svg" alt="Verified symbol" className="h-[14px] w-full" />
                                        </div>
                                        <Img src="images/img_frame_427318921.svg" alt="Circle image" className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[48px] w-[84%] rounded-[50%]" />
                                    </div>
                                    <Text as="p" className="text-[12px] font-normal">MSSN</Text>
                                </div>
                                <div className="flex flex-1 flex-col items-center gap-1 sm:self-stretch">
                                    <div className="self-stretch rounded-[26px] border border-solid border-[#ff6682]">
                                        <div className="flex items-center">
                                            <div className="flex flex-1 flex-col items-center rounded-[24px] bg-[#ffffff] py-1">
                                                <Img src="images/img_unilag_logo_1.png" alt="Unilag logo one" className="h-[40px] object-cover" />
                                            </div>
                                            <Img src="images/img_verified_symbol_icon.svg" alt="Verified symbol" className="relative ml-[-10px] h-[14px] w-[16px] self-end" />
                                        </div>
                                    </div>
                                    <Text as="p" className="text-[12px] font-normal">DSA</Text>
                                </div>
                                <div className="flex flex-1 flex-col items-start gap-0.5 sm:self-stretch">
                                    <div className="relative h-[54px] content-center self-stretch md:h-auto">
                                        <div className="flex h-full items-center">
                                            <div className="h-[54px] w-[54px] rounded-[26px] border border-solid border-[#ff6682]" />
                                            <Img src="images/img_verified_symbol_icon.svg" alt="Verified symbol" className="relative mb-1 ml-[-10px] h-[14px] w-[16px] self-end" />
                                        </div>
                                        <div className="absolute bottom-0 left-[3px] top-8 my-auto mr-2 flex h-max flex-1 flex-col items-center rounded-[24px] bg-[#ffffff] py-1 md:mr-0">
                                            <Img src="images/img_unilag_logo_1.png" alt="Unilag logo one" className="h-[40px] object-cover" />
                                        </div>
                                    </div>
                                    <Text as="p" className="text-[12px] font-normal">UNILAG</Text>
                                </div>
                                <div className="flex flex-1 flex-col items-start gap-0.5 sm:self-stretch">
                                    <div className="flex rounded-[26px] border border-solid border-[#ff6682]">
                                        <div className="flex items-center">
                                            <Img src="images/img_image_3.png" alt="Image three" className="h-[48px] w-[48px] rounded-[24px] object-cover" />
                                            <Img src="images/img_verified_symbol_icon.svg" alt="Verified symbol" className="relative ml-[-10px] h-[14px] w-[16px] self-end" />
                                        </div>
                                    </div>
                                    <Text as="p" className="ml-1.5 text-[12px] font-normal md:ml-0">FESSA</Text>
                                </div>
                                <div className="flex flex-1 flex-col items-center gap-0.5 self-center sm:self-stretch">
                                    <div className="ml-1 self-stretch rounded-[26px] border border-solid border-[#ff6682] md:m1-0">
                                        <div className="flex items-center">
                                            <div className="flex-1 rounded-[24px] bg-[#ffffff]">
                                                <Img src="images/img_image_1.png" alt="Image one" className="h-[46px] w-full rounded-t1-[24px] rounded-tr-[24px] object-cover md:h-auto" />
                                            </div>
                                            <Img src="images/img_verified_symbol_icon.svg" alt="Verified symbol" className="relative ml-[-10px] h-[14px] w-[16px] self-end" />
                                        </div>
                                    </div>
                                    <Text as="p" className="text-center text-[12px] font-normal leading-4">
                                        <span>Medical</span>
                                        <br />
                                        <span>centre</span>
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ml-[22px] mt-3 flex flex-col items-start justify-center gap-2.5 md:ml-0">
                        <Text as="p" className="text-[24px] font-medium md:text-[22px]">
                            Accounts you follow
                        </Text>
                        <div className="mr-7 flex flex-col gap-4 self-stretch py-2.5 md:mr-0">
                            <Suspense fallback={<div>Loading feed...</div>}>
                                {data1.map((d, index) => (
                                <Common {...d} key={"listdeanof" + index} />
                                ))}
                            </Suspense>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start rounded-[32px] border border-solid border-[#bebebe] px-[22px] py-5 sm:px-5">
                    <SearchInput
                        size={2}
                        name="searchFive"
                        placeholder="Search Varsigram"
                        value={searchBarValue6}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchBarValue6(e.target.value)}
                        prefix={
                          <span className="shrink-0">
                            <Img
                              src="images/img_search_gray_800.svg"
                              alt="Search"
                              className="h-[18px] w-[20px] object-contain"
                            />
                          </span>
                        }
                        suffix={searchBarValue6?.length > 0 ? (
                          <CloseSVG onClick={() => setSearchBarValue6("")} height={18} fillColor="gray_800" />
                        ) : null}
                        className="gap-2.5 self-stretch rounded-[24px] !border-[1.5px]"
                    />
                    <Text as="p" className="mt-5 text-[24px] font-medium md:text-[22px]">
                        Who to follow
                    </Text>
                    <div className="mb-[18px] mr-2 mt-3 flex flex-col gap-5 self-stretch py-2.5 md:mr-0">
                        <Suspense fallback={<div>Loading feed...</div>}>
                            {data.map((d, index) => (
                                <Common4 {...d} key={"listfollow" + index} />
                            ))}
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}