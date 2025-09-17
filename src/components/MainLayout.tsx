// src/components/MainLayout.tsx
import { Outlet, ScrollRestoration } from "react-router-dom";

import Sidebar1 from './Sidebar1';
import BottomNav from './BottomNav';

export default function MainLayout() {
  return (
    <div className="flex items-start justify-center w-full relative bg-[#f6f6f6] min-h-screen">
      
        
          <Sidebar1 />
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
        <BottomNav />
      </main>
    </div>
  );
}