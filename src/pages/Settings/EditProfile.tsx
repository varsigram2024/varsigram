import React, { useEffect, useState } from "react";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Sidebar1 from "../../components/Sidebar1";
import BottomNav from "../../components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getProfile, updateStudent, updateOrganization } from "../../services/API";
import { toast } from "react-toastify";
import { Pencil, Save } from "lucide-react";

export default function EditProfile() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [profileType, setProfileType] = useState<"student" | "organization" | null>(null);
  const [fields, setFields] = useState<any>({});
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await getProfile(token);
        setProfileType(res.data.profile_type);
        if (res.data.profile_type === "student") {
          const p = res.data.profile;
          setFields({
            email: p.user.email,
            bio: p.user.bio,
            name: p.name,
            faculty: p.faculty,
            department: p.department,
            year: p.year,
            religion: p.religion,
            phone_number: p.phone_number,
            sex: p.sex,
            university: p.university,
            date_of_birth: p.date_of_birth,
          });
        } else if (res.data.profile_type === "organization") {
          const p = res.data.profile;
          setFields({
            email: p.user.email,
            bio: p.user.bio,
            organization_name: p.organization_name,
          });
        }
      } catch {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, [token]);

  // Initialize editMode for all fields when fields are set
  useEffect(() => {
    const fieldKeys = Object.keys(fields);
    const initialEditMode: { [key: string]: boolean } = {};
    fieldKeys.forEach(key => { initialEditMode[key] = false; });
    setEditMode(initialEditMode);
  }, [fields]);

  // Handle field change
  const handleChange = (key: string, value: string) => {
    setFields((prev: any) => ({ ...prev, [key]: value }));
  };

  // Toggle edit mode for a field
  const toggleEdit = (key: string) => {
    setEditMode((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Save changes
  const handleSave = async (key: string) => {
    if (!token) return;
    setLoading(true);
    try {
      if (profileType === "student") {
        // Only send the field being edited
        const payload: any = {};
        if (key === "email" || key === "bio") {
          payload.user = { [key]: fields[key] };
        } else {
          payload[key] = fields[key];
        }
        await updateStudent(payload, token);
      } else if (profileType === "organization") {
        const payload: any = {};
        if (key === "email" || key === "bio") {
          payload.user = { [key]: fields[key] };
        } else {
          payload[key] = fields[key];
        }
        await updateOrganization(payload, token);
      }
      toast.success("Profile updated!");
      setEditMode((prev) => ({ ...prev, [key]: false }));
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Render fields
  const renderField = (label: string, key: string, type: string = "text") => (
    <div className="mb-4 flex items-center">
      <Text className="w-40 font-medium">{label}</Text>
      {editMode[key] ? (
        <>
          <input
            type={type}
            value={fields[key] || ""}
            onChange={e => handleChange(key, e.target.value)}
            className="border rounded px-2 py-1 flex-1 mr-2"
          />
          <button
            onClick={() => handleSave(key)}
            disabled={loading}
            className="text-green-600"
            title="Save"
          >
            <Save size={18} />
          </button>
        </>
      ) : (
        <>
          <span className="flex-1">{fields[key] || <span className="text-gray-400">Not set</span>}</span>
          <button
            onClick={() => toggleEdit(key)}
            className="text-blue-600 ml-2"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative">
      <Sidebar1 />
      <div className="flex flex-col w-full lg:w-[85%] p-6">
        <Text className="text-2xl font-bold mb-6">Edit Profile</Text>
        {profileType === "student" && (
          <form>
            {renderField("Email", "email")}
            {renderField("Bio", "bio")}
            {renderField("Name", "name")}
            {renderField("Faculty", "faculty")}
            {renderField("Department", "department")}
            {renderField("Year", "year")}
            {renderField("Religion", "religion")}
            {renderField("Phone Number", "phone_number")}
            {renderField("Sex", "sex")}
            {renderField("University", "university")}
            {renderField("Date of Birth", "date_of_birth", "date")}
          </form>
        )}
        {profileType === "organization" && (
          <form>
            {renderField("Email", "email")}
            {renderField("Bio", "bio")}
            {renderField("Organization Name", "organization_name")}
          </form>
        )}
        <Button className="mt-4" onClick={() => navigate(-1)}>Back</Button>
      </div>
      <BottomNav />
    </div>
  );
}
