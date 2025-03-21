import { ArrowLeft, Search, Phone, MoreVertical } from "lucide-react"

export default function ChatHeader() {
  return (
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
  )
}

