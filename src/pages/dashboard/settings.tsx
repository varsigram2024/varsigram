import AccountSettings from "../settings/accountSettings";
import SettingsSidebar from "../settings/sidebar";

export default function SettingsPage() {
  return (
    <>
      <SettingsSidebar />
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-6">Account</h1>
          <AccountSettings />
        </div>
      </div>
    </>
  )
}

