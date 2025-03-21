"use client"

import { Home, Users, MessageSquare, BookOpen, Settings } from "lucide-react"

interface SidebarProps {
  activePage: "home" | "users" | "chat" | "book" | "settings"
  setActivePage: (page: "home" | "users" | "chat" | "book" | "settings") => void
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <div className="flex flex-col w-16 border-r border-[#f0f0f0] bg-white">
      <div className="p-4">
        <div className="w-8 h-8 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 5L23 23M5 23L23 5" stroke="#a8223a" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col items-center gap-8 mt-8">
        <button
          className={`w-8 h-8 flex items-center justify-center ${activePage === "home" ? "text-[#a8223a]" : "text-[#5e6367] hover:text-[#a8223a]"}`}
          onClick={() => setActivePage("home")}
        >
          <Home size={24} />
        </button>
        <button
          className={`w-8 h-8 flex items-center justify-center ${activePage === "users" ? "text-[#a8223a]" : "text-[#5e6367] hover:text-[#a8223a]"}`}
          onClick={() => setActivePage("users")}
        >
          <Users size={24} />
        </button>
        <button
          className={`w-8 h-8 flex items-center justify-center ${activePage === "chat" ? "text-[#a8223a]" : "text-[#5e6367] hover:text-[#a8223a]"}`}
          onClick={() => setActivePage("chat")}
        >
          <MessageSquare size={24} />
        </button>
        <button
          className={`w-8 h-8 flex items-center justify-center ${activePage === "book" ? "text-[#a8223a]" : "text-[#5e6367] hover:text-[#a8223a]"}`}
          onClick={() => setActivePage("book")}
        >
          <BookOpen size={24} />
        </button>
        <button
          className={`w-8 h-8 flex items-center justify-center ${activePage === "settings" ? "text-[#a8223a]" : "text-[#5e6367] hover:text-[#a8223a]"}`}
          onClick={() => setActivePage("settings")}
        >
          <Settings size={24} />
        </button>
      </div>
    </div>
  )
}

