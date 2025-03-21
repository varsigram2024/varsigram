import { ChevronRight } from "lucide-react"

export default function AccountSettings() {
  const settingItems = [
    { id: "profile", title: "Edit Profile", isHeader: true },
    { id: "picture", title: "Profile picture", hasArrow: true },
    { id: "bio", title: "Bio", hasArrow: true },
    { id: "username", title: "Username & Display name", hasArrow: true },
    { id: "university", title: "University details", hasArrow: true },
    { id: "security", title: "Login and Security", isHeader: true, hasDivider: true },
    { id: "sessions", title: "Device login session(s)", hasArrow: true },
    { id: "management", title: "Account Management", isHeader: true, hasDivider: true },
    { id: "verification", title: "Account verification", hasArrow: true },
    { id: "email", title: "Change email or phone number", hasArrow: true },
    { id: "password", title: "Change password", hasArrow: true },
    { id: "privacy", title: "Privacy Settings", isHeader: true, hasDivider: true },
    { id: "blocked", title: "Blocked users list", hasArrow: true },
  ]

  return (
    <div className="space-y-4">
      {settingItems.map((item) => (
        <div key={item.id}>
          {item.hasDivider && <div className="border-t border-[#f0f0f0] my-6"></div>}

          {item.isHeader ? (
            <h2 className="text-lg font-semibold mt-4 mb-2">{item.title}</h2>
          ) : (
            <div className="flex items-center justify-between py-3 cursor-pointer hover:bg-[#f6f6f6] px-2 rounded-md">
              <span>{item.title}</span>
              {item.hasArrow && <ChevronRight className="h-5 w-5 text-[#adacb2]" />}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

