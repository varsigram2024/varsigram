import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // TODO: Call your API to send reset email here
    // Example: await API.post('/forgot-password', { email });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full p-8 rounded shadow bg-white">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        {submitted ? (
          <p className="text-green-600">If this email exists, a reset link has been sent.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button fullWidth>Send Reset Link</Button>
            <button
              type="button"
              className="text-sm text-[#750015] hover:underline mt-2"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
