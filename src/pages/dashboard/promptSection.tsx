import { Search } from "lucide-react"

export default function PromptSection() {
  const prompts = [
    { id: 1, name: "NESA", logo: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "MSSN", logo: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "DSA", logo: "/placeholder.svg?height=40&width=40" },
    { id: 4, name: "UNILAG", logo: "/placeholder.svg?height=40&width=40" },
    { id: 5, name: "FESSA", logo: "/placeholder.svg?height=40&width=40" },
    { id: 6, name: "Medical Centre", logo: "/placeholder.svg?height=40&width=40" },
  ]

  return (
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
  )
}

