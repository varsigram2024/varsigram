import { Search } from "lucide-react"

export default function SettingsSidebar() {
  const settingsCategories = [
    { id: "account", name: "Account", isActive: true },
    { id: "notification", name: "Notification", isActive: false },
    { id: "legal", name: "About and Legal", isActive: false },
    { id: "logout", name: "Logout and Delete Account", isActive: false },
  ]

  return (
    <div className="w-80 border-r border-[#f0f0f0] bg-white overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Settings</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#adacb2]" />
          <input
            type="text"
            placeholder="Search Settings"
            className="w-full pl-9 bg-[#f6f6f6] border-none rounded-md h-9 text-sm focus:outline-none focus:ring-1 focus:ring-[#a8223a]"
          />
        </div>
      </div>

      <div className="px-2 mt-4">
        {settingsCategories.map((category) => (
          <div
            key={category.id}
            className={`p-3 rounded-lg cursor-pointer ${category.isActive ? "bg-[#f6f6f6]" : "hover:bg-[#f6f6f6]"}`}
          >
            <span className="font-medium">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

