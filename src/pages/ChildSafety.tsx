import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Text } from "../components/Text/index.tsx";

const ChildSafety: React.FC = () => {
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
          <Text className="text-2xl font-bold">Child Safety Standards</Text>
        </div>

        <h1 className="text-2xl font-bold mb-2">Varsigram Child Safety Standards</h1>
        <p className="text-sm text-gray-500 mb-4">
          Effective Date: 10th June, 2025
        </p>

        <p className="mb-4">
          Varsigram is committed to providing a safe, respectful, and secure digital campus for all users. We maintain zero tolerance for child sexual abuse, exploitation, or any activity that endangers minors.
        </p>

        <p className="mb-4">
          Although Varsigram is primarily designed for tertiary institution students, we take proactive steps to ensure the safety of all users on our platform.
        </p>

        <h2 className="text-xl font-semibold mb-2 mt-6">Zero Tolerance Policy on CSAE</h2>
        <p className="mb-4">
          Varsigram strictly prohibits:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Child Sexual Abuse Material (CSAM)</li>
          <li>Sexual exploitation of minors</li>
          <li>Grooming or predatory behavior</li>
          <li>Sexualized content involving minors</li>
          <li>Harassment, coercion, or inappropriate communication with minors</li>
        </ul>
        <p className="mb-4">
          Any content or behavior violating these rules is removed immediately.
        </p>

        <h2 className="text-xl font-semibold mb-2 mt-6">Safety & Moderation Measures</h2>
        <p className="mb-4">
          To enforce child safety, Varsigram implements the following measures:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Clear community guidelines against harmful content</li>
          <li>User reporting tools for flagging inappropriate content or behavior</li>
          <li>Prompt review of reported content</li>
          <li>Immediate removal of violating content</li>
          <li>Suspension or permanent banning of offending accounts</li>
          <li>Cooperation with law enforcement authorities where required by law</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2 mt-6">Reporting Child Safety Concerns</h2>
        <p className="mb-4">
          Users can report harmful or suspicious content directly within the app.
        </p>
        <p className="mb-4">
          Child safety concerns can also be reported via email:
        </p>
        <p className="mb-4">
          <a href="mailto:varsigraminfo@gmail.com" className="text-[#750015] underline">varsigraminfo@gmail.com</a>
        </p>
        <p className="mb-4">
          All reports are treated seriously and handled confidentially.
        </p>

        <h2 className="text-xl font-semibold mb-2 mt-6">Compliance</h2>
        <p className="mb-4">
          Varsigram complies with:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Google Play Child Safety Standards</li>
          <li>Applicable local and international child protection laws</li>
          <li>Best practices for online safety and digital communities</li>
        </ul>

        <p className="mb-4">
          We are continuously improving our systems to ensure a safe environment for learning, collaboration, and growth.
        </p>

        <h2 className="text-xl font-semibold mb-2 mt-6">Contact Information</h2>
        <p className="mb-4">
          For child safety, abuse prevention, or compliance-related concerns:
        </p>
        <p className="mb-2">
          Email: <a href="mailto:varsigraminfo@gmail.com" className="text-[#750015] underline">varsigraminfo@gmail.com</a>
        </p>
        <p>
          Platform: Varsigram
        </p>
      </div>
    </div>
  );
};

export default ChildSafety;