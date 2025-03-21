"use client"

import { useState } from "react"
import {
  Search,
  Home,
  Users,
  MessageSquare,
  BookOpen,
  Settings,
  Image,
  Mic,
  ArrowLeft,
  Phone,
  MoreVertical,
} from "lucide-react"

export default function ChatInterface() {
  const [message, setMessage] = useState("")

  const messages = [
    {
      id: 1,
      sender: "me",
      content: "Hi Caitlyn!\nAre you going to the coding workshop next Friday?",
      time: "10:55",
      isRead: true,
    },
    {
      id: 2,
      sender: "other",
      content: "Hey John! I'm not sure yet. What's it about?",
      time: "10:55",
      isRead: true,
    },
    {
      id: 3,
      sender: "me",
      content: "It's on building AI models. I think it'll be useful for our project.",
      time: "10:55",
      isRead: true,
    },
    {
      id: 4,
      sender: "other",
      content: "That sounds cool! Can you send me the link to sign up?",
      time: "10:55",
      isRead: true,
    },
    {
      id: 5,
      sender: "me",
      content: "Also, I uploaded the latest draft for the project in our chat. Can you check it out?",
      time: "10:55",
      isRead: true,
    },
    {
      id: 6,
      sender: "other",
      content: "Got it. I'll review it tonight. Let's talk about it tomorrow?",
      time: "10:55",
      isRead: true,
    },
    {
      id: 7,
      sender: "me",
      content: "No problem.",
      time: "10:55",
      isRead: true,
    },
  ]

  const recentChats = [
    { id: 1, name: "Caitlyn", message: "No problem.", time: "3h", hasUnread: true },
    { id: 2, name: "Lawal Eniola", message: "I'll see you soon", time: "3h", hasUnread: true },
    { id: 3, name: "Michael Blessing", message: "Thanks for the advice", time: "3h", hasUnread: true },
    { id: 4, name: "Philips Excel", message: "Let's catch up soon", time: "3h", hasUnread: true },
    { id: 5, name: "Eze Victoria", message: "Have a great day", time: "3h", hasUnread: true },
    { id: 6, name: "Ibrahim Toheeb", message: "Just got there", time: "3h", hasUnread: false },
    { id: 7, name: "Mide Ovie", message: "Remember to bring your umbrella", time: "3h", hasUnread: false },
    { id: 8, name: "Bolu Adetunji", message: "Can't wait for the weekend", time: "3h", hasUnread: false },
  ]

  const prompts = [
    { id: 1, name: "NESA", logo: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "MSSN", logo: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "DSA", logo: "/placeholder.svg?height=40&width=40" },
    { id: 4, name: "UNILAG", logo: "/placeholder.svg?height=40&width=40" },
    { id: 5, name: "FESSA", logo: "/placeholder.svg?height=40&width=40" },
    { id: 6, name: "Medical Centre", logo: "/placeholder.svg?height=40&width=40" },
  ]

  return (
    <>
      {/* Left Sidebar */}
      <div className="flex flex-col w-16 border-r border-[#f0f0f0] bg-white">
        <div className="p-4">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 5L23 23M5 23L23 5" stroke="#a8223a" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col items-center gap-8 mt-8">
          <button className="w-8 h-8 flex items-center justify-center text-[#5e6367] hover:text-[#a8223a]">
            <Home size={24} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-[#5e6367] hover:text-[#a8223a]">
            <Users size={24} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-[#a8223a]">
            <MessageSquare size={24} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-[#5e6367] hover:text-[#a8223a]">
            <BookOpen size={24} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-[#5e6367] hover:text-[#a8223a]">
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* Messages Sidebar */}
      <div className="w-80 border-r border-[#f0f0f0] bg-white overflow-y-auto">
        <div className="p-4">
          <h1 className="text-xl font-semibold mb-4">Chats</h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#adacb2]" />
            <input
              type="text"
              placeholder="Search Messages"
              className="w-full pl-9 bg-[#f6f6f6] border-none rounded-md h-9 text-sm focus:outline-none focus:ring-1 focus:ring-[#a8223a]"
            />
          </div>
        </div>

        {/* Prompts Section */}
        <div className="px-4 pt-4">
          <h2 className="text-base font-semibold mb-2">Prompts</h2>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#fdd2da] flex items-center justify-center">
              <Search className="h-6 w-6 text-[#a8223a]" />
            </div>
            {prompts.map((prompt) => (
              <div key={prompt.id} className="flex-shrink-0 relative">
                <div className="w-14 h-14 rounded-full bg-white border border-[#f0f0f0] flex items-center justify-center overflow-hidden">
                  <img src={prompt.logo || "/placeholder.svg"} alt={prompt.name} className="w-10 h-10 object-contain" />
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] font-medium whitespace-nowrap">
                  {prompt.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="px-4 pt-4">
          <h2 className="text-base font-semibold mb-2">Messages</h2>
        </div>

        <div className="px-2">
          {recentChats.map((chat) => (
            <div key={chat.id} className="flex items-center gap-3 p-2 hover:bg-[#f6f6f6] rounded-lg cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                <img
                  src={`/placeholder.svg?height=40&width=40`}
                  alt={chat.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-sm">{chat.name}</span>
                    <span className="text-xs text-[#adacb2]">· {chat.time}</span>
                  </div>
                </div>
                <p className="text-sm text-[#5e6367] truncate">{chat.message}</p>
              </div>
              {chat.hasUnread && <div className="w-2 h-2 rounded-full bg-[#a8223a]"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="h-16 border-b border-[#f0f0f0] flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button className="text-[#5e6367] hover:text-[#a8223a]">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                <img src="/placeholder.svg?height=32&width=32" alt="Caitlyn" className="h-full w-full object-cover" />
              </div>
              <span className="font-medium">Caitlyn</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[#5e6367] hover:text-[#a8223a]">
              <Search size={20} />
            </button>
            <button className="text-[#5e6367] hover:text-[#a8223a]">
              <Phone size={20} />
            </button>
            <button className="text-[#5e6367] hover:text-[#a8223a]">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#f6f6f6]">
          <div className="max-w-3xl mx-auto">
            <div className="text-xs text-center text-[#5e6367] mb-4">Today</div>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "me" ? "justify-start" : "justify-end"}`}>
                  {message.sender === "me" && (
                    <div className="mr-2">
                      {message.id === 1 && (
                        <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                          <img
                            src="/placeholder.svg?height=32&width=32"
                            alt="User"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 whitespace-pre-wrap ${
                      message.sender === "me" ? "bg-[#f2f2f2] text-[#0f1419]" : "bg-[#a8223a] text-white"
                    }`}
                  >
                    {message.content}
                    <div
                      className={`text-xs mt-1 text-right ${
                        message.sender === "me" ? "text-[#adacb2]" : "text-[#ffdbe2]"
                      }`}
                    >
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-[#f0f0f0] bg-white">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <button className="text-[#5e6367] hover:text-[#a8223a]">
              <Image size={20} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Message..."
                className="w-full pr-10 bg-[#f6f6f6] border-none rounded-md h-10 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#a8223a]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button className="text-[#5e6367] hover:text-[#a8223a]">
              <Mic size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

