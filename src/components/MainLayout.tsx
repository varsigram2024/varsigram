// src/components/MainLayout.tsx
import Sidebar1 from './Sidebar1';
import BottomNav from './BottomNav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar1 />
      <div className="flex-1 flex flex-col w-full">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}