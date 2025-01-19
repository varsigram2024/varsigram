import { Logo } from '../components/Logo';

export const EmailVerification = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="p-6">
        <Logo />
      </header>
      <div className="max-w-[497px] mx-auto mt-12">
        <h1 className="text-[45px] font-semibold mb-4">Verify your account</h1>
        <p className="text-base text-[#4D4D4D] mb-8">
          Enter the 4 digit code sent to myemail@gmail.com
        </p>
        <div className="flex gap-6 mb-8">
          {[1, 2, 3, 4].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="w-14 h-14 text-3xl text-center border-[1.5px] border-[#B0B0B0] rounded-lg focus:border-[#750015] focus:ring-1 focus:ring-[#750015] focus:outline-none"
            />
          ))}
        </div>
      </div>
    </div>
  );
};