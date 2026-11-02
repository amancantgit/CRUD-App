export default function OnboardingScreen({ onGetStarted }) {
  return (
    <div className="relative w-full h-full min-h-screen sm:min-h-[780px] bg-[#2f65f6] flex flex-col justify-between overflow-hidden select-none">
      <div className="relative flex-1 flex flex-col justify-center items-center p-8 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full border-[18px] border-white/10 pointer-events-none" />

        <div className="absolute top-12 left-6 opacity-30">
          <svg width="88" height="60" viewBox="0 0 88 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12L24 32L44 12L64 32L84 12" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 28L24 48L44 28L64 48L84 28" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="relative z-10 w-44 h-44 rounded-3xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-xl">
          <div className="w-28 h-28 rounded-2xl bg-white/20 flex items-center justify-center">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 opacity-30">
          <svg width="88" height="60" viewBox="0 0 88 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12L24 32L44 12L64 32L84 12" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 28L24 48L44 28L64 48L84 28" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="w-full bg-white rounded-t-[36px] px-8 pt-8 pb-10 shadow-2xl flex flex-col z-20">
        <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
          Manage What To Do
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">
          The best way to manage what you have to do, don't forget your plans
        </p>

        <button
          type="button"
          onClick={onGetStarted}
          className="w-full py-4 rounded-xl bg-[#2f65f6] hover:bg-[#2554d3] active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
