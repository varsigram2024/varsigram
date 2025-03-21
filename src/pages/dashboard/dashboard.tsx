"use client"

import { useState } from "react"
import ChatHeader from "./chatHeader"
import ChatSidebar from "./chatSidebar"
import MessageInput from "./messageInput"
import MessageList from "./messageList"

export default function Dashboard() {
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

  return (
    <>
      <ChatSidebar />
      <div className="flex-1 flex flex-col bg-white">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 bg-[#f6f6f6]">
          <div className="max-w-3xl mx-auto">
            <div className="text-xs text-center text-[#5e6367] mb-4">Today</div>
            <MessageList messages={messages} />
          </div>
        </div>
        <MessageInput message={message} setMessage={setMessage} />
      </div>
    </>
  )
}

