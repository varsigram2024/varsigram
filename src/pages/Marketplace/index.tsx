import React from "react";
import Sidebar1 from "../../components/Sidebar1";
import BottomNav from "../../components/BottomNav";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";

export default function Marketplace() {
  const navigate = useNavigate();

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative">
      <Sidebar1 />
      <div className="flex flex-row-reverse w-full lg:w-[85%] items-start justify-center h-auto">
        <div className="hidden lg:flex mt-[38px] flex-1 items-center justify-center gap-[4px] md:flex-col md:self-stretch p-5">
          <Text as="h2" className="text-left w-[30%] text-[24px] font-extrabold">
            Marketplace Coming Soon!
          </Text>
          <Text as="p" className="text-left text-[14px] font-medium w-[30%]">
            Stay tuned! The marketplace feature is on its way to help you buy, sell, and connect on campus.
          </Text>
          <div className="text-left w-[30%]">
            <Button
              variant="outline"
              color="gray_400_01"
              size="2x1"
              className="mt-4 bg-[#750015] rounded-3xl p-4 text-white"
              onClick={() => navigate("/home")}
            >
              Back to Home
            </Button>
          </div>
        </div>
        <div className="flex flex-col max-w-full lg:max-w-[35%] gap-8">
          <div className="mt-[38px] flex flex-1 items-center justify-center gap-[45px] md:flex-col md:self-stretch">
            <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col lg:h-[100vh] max-h-full md:gap-[15px] lg:overflow-auto scrollbar-hide sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
              <div className="flex items-center gap-2.5 mb-8">
                <Text as="p" className="text-[24px] font-medium md:text-[22px]">
                  <b>Marketplace</b>
                </Text>
              </div>
              <div className="ml-[22px] flex flex-col items-center justify-center p-4 gap-2 md:ml-0 h-[400px]">
                <div className="flex flex-col items-center h-full justify-center gap-5">
                  <Text as="p" className="text-left self-start text-[24px] font-extrabold">
                    Marketplace Coming Soon!
                  </Text>
                  <Text as="p" className="text-left self-start text-[14px] font-medium">
                    Stay tuned! The marketplace feature is on its way to help you buy, sell, and connect on campus.
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
