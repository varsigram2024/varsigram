import { Search } from "lucide-react"
import PromptSection from "./promptSection"

export default function ChatSidebar() {
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

  return (
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

      <PromptSection />

      <div className="px-4 pt-4">
        <h2 className="text-base font-semibold mb-2">Messages</h2>
      </div>

      <div className="px-2">
        {recentChats.map((chat) => (
          <div key={chat.id} className="flex items-center gap-3 p-2 hover:bg-[#f6f6f6] rounded-lg cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              <img src={`/placeholder.svg?height=40&width=40`} alt={chat.name} className="h-full w-full object-cover" />
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
  )
}

