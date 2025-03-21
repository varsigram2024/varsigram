"use client"

import { Image, Mic } from "lucide-react"

interface MessageInputProps {
  message: string
  setMessage: (message: string) => void
}

export default function MessageInput({ message, setMessage }: MessageInputProps) {
  return (
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
  )
}

