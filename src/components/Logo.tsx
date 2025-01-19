import logo from '../public/logo.png';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 text-[#750015]">
      <img src={logo} alt="VARSIGRAM Logo" className="w-29 h-5" />
    </div>
  );
};
