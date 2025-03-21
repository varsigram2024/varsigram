interface Message {
    id: number
    sender: "me" | "other"
    content: string
    time: string
    isRead: boolean
  }
  
  interface MessageListProps {
    messages: Message[]
  }
  
  export default function MessageList({ messages }: MessageListProps) {
    return (
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "me" ? "justify-start" : "justify-end"}`}>
            {message.sender === "me" && (
              <div className="mr-2">
                {message.id === 1 && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                    <img src="/placeholder.svg?height=32&width=32" alt="User" className="h-full w-full object-cover" />
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
              <div className={`text-xs mt-1 text-right ${message.sender === "me" ? "text-[#adacb2]" : "text-[#ffdbe2]"}`}>
                {message.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  