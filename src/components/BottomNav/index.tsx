import React from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { Text } from "../Text";
import { Img } from "../Img";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname.replace('/', '');

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-between items-center">

        
        <div 
          onClick={() => handleNavigation('home')}
          className={`flex flex-col items-center ${currentPage === 'home' ? 'text-[#750015]' : 'text-gray-600'}`}
        >
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={currentPage === 'home' ? 'text-[#750015]' : 'text-gray-600'}>
            <path d="M7.08848 5.22458L6.08847 6.00547C4.57182 7.18981 3.81348 7.78199 3.40674 8.61695C3 9.45191 3 10.4165 3 12.3455V14.4376C3 18.2239 3 20.1171 4.17157 21.2934C5.11466 22.2402 6.52043 22.4249 9 22.4609V18.4666C9 17.5347 9 17.0687 9.15224 16.7012C9.35523 16.2111 9.74458 15.8218 10.2346 15.6188C10.6022 15.4666 11.0681 15.4666 12 15.4666C12.9319 15.4666 13.3978 15.4666 13.7654 15.6188C14.2554 15.8218 14.6448 16.2111 14.8478 16.7012C15 17.0687 15 17.5347 15 18.4666V22.4609C17.4796 22.4249 18.8853 22.2402 19.8284 21.2934C21 20.1171 21 18.2239 21 14.4376V12.3455C21 10.4165 21 9.45191 20.5933 8.61695C20.1865 7.78199 19.4282 7.18981 17.9115 6.00547L16.9115 5.22458C14.5521 3.38215 13.3724 2.46094 12 2.46094C10.6276 2.46094 9.44787 3.38215 7.08848 5.22458Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <Text as="p" className={`mt-1 ${currentPage === 'home' ? 'text-[#750015]' : 'text-gray-600'}`}></Text>
        </div>
        


        <div 
          onClick={() => handleNavigation('connections')}
          className={`flex flex-col items-center ${currentPage === 'connections' ? 'text-[#750015]' : 'text-gray-600'}`}
        >
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={currentPage === 'connections' ? 'text-[#750015]' : 'text-gray-600'}>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={currentPage === 'connections' ? 'text-[#750015]' : 'text-gray-600'}>
          <path d="M16.0352 8.20703C16.0352 10.0192 14.5661 11.4883 12.7539 11.4883C10.9417 11.4883 9.47266 10.0192 9.47266 8.20703C9.47266 6.39485 10.9417 4.92578 12.7539 4.92578C14.5661 4.92578 16.0352 6.39485 16.0352 8.20703Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M17.1289 3.83203C18.941 3.83203 20.4102 5.3011 20.4102 7.11328C20.4102 8.45104 19.6095 9.60181 18.4614 10.1127" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M14.6289 14.7695H10.8789C8.29007 14.7695 6.19141 16.8682 6.19141 19.457C6.19141 20.4926 7.03087 21.332 8.0664 21.332H17.4414C18.477 21.332 19.3164 20.4926 19.3164 19.457C19.3164 16.8682 17.2177 14.7695 14.6289 14.7695Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M19.0039 13.6758C21.5927 13.6758 23.6914 15.7745 23.6914 18.3633C23.6914 19.3988 22.8519 20.2383 21.8164 20.2383" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.37891 3.83203C6.56673 3.83203 5.09766 5.3011 5.09766 7.11328C5.09766 8.45104 5.8982 9.60181 7.04637 10.1127" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.69141 20.2383C2.65587 20.2383 1.81641 19.3988 1.81641 18.3633C1.81641 15.7745 3.91507 13.6758 6.5039 13.6758" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          </svg>
          <Text as="p" className={`mt-1 ${currentPage === 'connections' ? 'text-[#750015]' : 'text-gray-600'}`}></Text>
        </div>



        
        <div 
          onClick={() => handleNavigation('chat')}
          className={`flex flex-col items-center ${currentPage === 'chat' ? 'text-[#750015]' : 'text-gray-600'}`}
        >
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={currentPage === 'chat' ? 'text-[#750015]' : 'text-gray-600'}>
          <path d="M22 12.1526C22 17.4358 17.5222 21.7193 12 21.7193C11.3507 21.7202 10.7032 21.6601 10.0654 21.5404C9.60633 21.4541 9.37678 21.411 9.21653 21.4355C9.05627 21.46 8.82918 21.5807 8.37499 21.8223C7.09014 22.5056 5.59195 22.7469 4.15111 22.4789C4.69874 21.8053 5.07275 20.9971 5.23778 20.1307C5.33778 19.6007 5.09 19.0859 4.71889 18.709C3.03333 16.9974 2 14.691 2 12.1526C2 6.86951 6.47778 2.58594 12 2.58594C17.5222 2.58594 22 6.86951 22 12.1526Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
            <Text as="p" className={`mt-1 ${currentPage === 'chat' ? 'text-[#750015]' : 'text-gray-600'}`}></Text>
        </div>


        
        <div 
          onClick={() => handleNavigation('resources')}
          className={`flex flex-col items-center ${currentPage === 'resources' ? 'text-[#750015]' : 'text-gray-600'}`}
        >
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={currentPage === 'resources' ? 'text-[#750015]' : 'text-gray-600'}>
          <path d="M2 7.58594C2 6.18581 2 5.48574 2.27248 4.95096C2.51217 4.48056 2.89462 4.09811 3.36502 3.85842C3.8998 3.58594 4.59987 3.58594 6 3.58594C7.40013 3.58594 8.1002 3.58594 8.63498 3.85842C9.10538 4.09811 9.48783 4.48056 9.72752 4.95096C10 5.48574 10 6.18581 10 7.58594V17.5859C10 18.986 10 19.6861 9.72752 20.2209C9.48783 20.6913 9.10538 21.0737 8.63498 21.3134C8.1002 21.5859 7.40013 21.5859 6 21.5859C4.59987 21.5859 3.8998 21.5859 3.36502 21.3134C2.89462 21.0737 2.51217 20.6913 2.27248 20.2209C2 19.6861 2 18.986 2 17.5859V7.58594Z" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 17.5859H6.00898" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 7.58594H10" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.4486 8.85437C11.0937 7.52432 10.9163 6.8593 11.0385 6.28193C11.146 5.77406 11.4108 5.31341 11.7951 4.96599C12.2319 4.57102 12.8942 4.39283 14.2187 4.03644C15.5432 3.68006 16.2055 3.50187 16.7804 3.62459C17.2862 3.73254 17.7449 3.9985 18.0909 4.38435C18.4842 4.823 18.6617 5.48803 19.0166 6.81807L21.5514 16.3175C21.9063 17.6475 22.0837 18.3125 21.9615 18.8899C21.854 19.3978 21.5892 19.8584 21.2049 20.2059C20.7681 20.6008 20.1058 20.779 18.7813 21.1354C17.4568 21.4918 16.7945 21.67 16.2196 21.5473C15.7138 21.4393 15.2551 21.1733 14.9091 20.7875C14.5158 20.3488 14.3383 19.6838 13.9834 18.3538L11.4486 8.85437Z" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.7812 17.2796L17.7899 17.2773" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8.58613L18.5001 6.58594" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
            <Text as="p" className={`mt-1 ${currentPage === 'chat' ? 'text-[#750015]' : 'text-gray-600'}`}></Text>
        </div>


        
        <div 
          onClick={() => handleNavigation('marketplace')}
          className={`flex flex-col items-center ${currentPage === 'marketplace' ? 'text-[#750015]' : 'text-gray-600'}`}
        >
         <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={currentPage === 'marketplace' ? 'text-[#750015]' : 'text-gray-600'}>
          <path d="M2.96875 11.082V16.0838C2.96875 18.9132 2.96875 20.3279 3.84743 21.2069C4.72611 22.086 6.14032 22.086 8.96875 22.086H14.9688C17.7971 22.086 19.2113 22.086 20.09 21.2069C20.9687 20.3279 20.9688 18.9132 20.9688 16.0838V11.082" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round"/>
          <path d="M14.9688 17.5781C14.2847 18.1853 13.1955 18.5781 11.9688 18.5781C10.742 18.5781 9.65284 18.1853 8.96875 17.5781" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round"/>
          <path d="M10.1038 9.00393C9.82182 10.0223 8.79628 11.779 6.84777 12.0336C5.12733 12.2584 3.82246 11.5074 3.48916 11.1934C3.12168 10.9388 2.28416 10.1242 2.07906 9.61497C1.87395 9.10577 2.11324 8.00251 2.28416 7.55271L2.96743 5.57433C3.13423 5.07741 3.5247 3.90211 3.92501 3.50458C4.32533 3.10705 5.13581 3.08975 5.4694 3.08975H12.4749C14.2781 3.11523 18.2209 3.07367 19.0003 3.08976C19.7797 3.10584 20.2481 3.75918 20.3848 4.03924C21.5477 6.85606 22 8.46927 22 9.15669C21.8482 9.89001 21.22 11.2727 19.0003 11.8809C16.6933 12.5129 15.3854 11.2835 14.9751 10.8115M9.15522 10.8115C9.47997 11.2104 10.4987 12.0133 11.9754 12.0336C13.4522 12.054 14.7273 11.0237 15.1802 10.5061C15.3084 10.3533 15.5853 9.90012 15.8725 9.00393" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
            <Text as="p" className={`mt-1 ${currentPage === 'chat' ? 'text-[#750015]' : 'text-gray-600'}`}></Text>
        </div>
      </div>
    </div>
  );
}
