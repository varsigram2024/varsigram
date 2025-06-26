import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import API from "../services/API"; // Uncomment and use your actual API
import axios from "axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Get params from URL
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
  console.log(uid);
  console.log(token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("uid:", uid, "token:", token);
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);

    try {
      // Replace with your actual API call
      await axios.post(
        `https://api.varsigram.com/api/v1/password-reset-confirm/?uid=${encodeURIComponent(uid || "")}&token=${encodeURIComponent(token || "")}`,
        {
          new_password: password,
          confirm_password: confirmPassword
        }
      );
      setMessage("Password reset successful! You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError("Failed to reset password. The link may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!uid || !token ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow">
          <h1 className="text-xl font-bold mb-4">Invalid Link</h1>
          <p>The reset password link is invalid or missing required parameters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full p-8 rounded shadow bg-white">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-600">{message}</p>}
          <Button fullWidth loading={loading}>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
