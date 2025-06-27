import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Text } from "../../components/Text/index.tsx";

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-archivo px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Text className="text-2xl font-bold">Privacy Policy</Text>
        </div>

        <h1 className="text-2xl font-bold mb-2">Varsigram Data & Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-4">
          Effective Date: 27/06/2025<br />
          Last Updated: 26/06/2025
        </p>

        <p className="mb-4">
          At Varsigram, we are committed to protecting your privacy, maintaining your trust, and ensuring that your personal and academic data is handled securely and transparently. This Privacy Policy outlines how we collect, use, and protect your data when you use our platform.
        </p>

        <h2 className="text-xl font-semibold mb-2 mt-6">1. Information We Collect</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Basic Profile Information: Name, institution, faculty, department, level, email, date of birth, religion, and profile picture.</li>
          <li>Activity Data: Posts (Vars), messages, comments, likes, and community participation.</li>
          <li>Academic Data (Optional): Uploaded documents (e.g. notes, past questions), academic interests, schedules.</li>
          <li>Usage Data: Login activity and app usage.</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2 mt-6">2. How We Use Your Data</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Deliver personalized academic content and updates.</li>
          <li>Help you connect with verified communities and classmates.</li>
          <li>Improve our services through usage analysis.</li>
          <li>Prevent impersonation, scams, and fake accounts.</li>
          <li>Recommend academic resources, events, and opportunities.</li>
        </ul>
        <p className="mb-4">Varsigram does not sell your data to third parties.</p>

        <h2 className="text-xl font-semibold mb-2 mt-6">3. Who Can See Your Information</h2>
        <ul className="list-disc pl-6 mb-4">
          <li><b>Other Students:</b> Can see your name, faculty, department, and Vars posts depending on your visibility settings.</li>
          <li><b>Institutional Accounts:</b> May view academic participation and engagement within their group or class.</li>
          <li><b>Public Access:</b> No personal data is shared publicly unless you make it public intentionally (e.g., in Vars posts).</li>
          <li><b>Third Parties:</b> Only anonymized, aggregated data may be shared for analytics or research partnerships — never identifying individuals.</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2 mt-6">4. Content</h2>
        <p className="mb-4">
          You retain full ownership of the content you create, but grant Varsigram permission to display and manage that content as part of our platform.
        </p>

        <h2 className="text-xl font-semibold mb-2 mt-6">5. Data Security</h2>
        <p className="mb-4">
          We use industry-standard encryption, secure servers, and verified login systems to protect your data. We regularly audit and update our systems to prevent breaches and unauthorized access.
        </p>

        <h2 className="text-xl font-semibold mb-2 mt-6">6. Your Rights</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Access the data we hold about you.</li>
          <li>Request correction or deletion of your data.</li>
          <li>Download your personal information.</li>
          <li>Deactivate or delete your account at any time.</li>
          <li>Contact us at <a href="mailto:varsigraminfo@gmail.com" className="text-[#750015] underline">varsigraminfo@gmail.com</a> to make any of these requests.</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2 mt-6">7. Legal Basis for Data Processing</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Contractual necessity: To deliver the services you sign up for.</li>
          <li>Legitimate interest: To improve your academic experience.</li>
          <li>User consent: Especially for sensitive or optional data.</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2 mt-6">8. Children and Underage Users</h2>
        <p className="mb-4">
          Varsigram is intended for students in tertiary institutions only (typically ages 16+). We do not knowingly collect data from individuals outside this group.
        </p>

        <h2 className="text-xl font-semibold mb-2 mt-6">9. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this policy from time to time. If changes are significant, we will notify you through your account or via email.
        </p>

        <h2 className="text-xl font-semibold mb-2 mt-6">10. Contact Us</h2>
        <p>
          For questions, feedback, or data concerns, please contact:<br />
          Email: <a href="mailto:varsigraminfo@gmail.com" className="text-[#750015] underline">varsigraminfo@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;


