"use client"
import Link from "next/link"

export default function LandingPage() {
  return (
    // Full-page dark gradient background
    <div className="min-h-[calc(100vh-4rem-1px)] flex flex-col items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-sky-900 text-slate-100 px-6">
      {/* Main card */}
      <div className="w-full max-w-3xl bg-linear-to-br from-slate-800/80 to-slate-900/70 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-8 flex flex-col items-center">
        {/* Logo / Icon */}
        <div className="mb-6">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="url(#grad)" />
            <path d="M18 36V20a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H20a2 2 0 01-2-2z" fill="#fff" fillOpacity="0.12" />
            <path d="M22 24h12M22 28h8M22 32h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-3 text-center drop-shadow-lg">
          Content AI
        </h1>
        {/* Subtitle */}
        <p className="text-lg text-slate-300 mb-6 text-center max-w-xl">
          Effortlessly create, enhance, and customize scripts for your content with the power of AI. Perfect for creators, marketers, educators, and more.
        </p>
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full">
          <div className="flex items-start gap-3">
            <span className="bg-sky-600/80 rounded-full p-2">
              <svg width="24" height="24" fill="none"><path d="M12 4v16m8-8H4" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
            </span>
            <div>
              <h3 className="font-semibold text-slate-100">Generate Scripts Instantly</h3>
              <p className="text-sm text-slate-300">Turn your ideas into polished scripts in seconds.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-indigo-600/80 rounded-full p-2">
              <svg width="24" height="24" fill="none"><path d="M5 12h14M12 5v14" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
            </span>
            <div>
              <h3 className="font-semibold text-slate-100">Enhance & Customize</h3>
              <p className="text-sm text-slate-300">Refine tone, structure, and style to fit your brand.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-sky-700/80 rounded-full p-2">
              <svg width="24" height="24" fill="none"><path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
            </span>
            <div>
              <h3 className="font-semibold text-slate-100">Find Inspiration</h3>
              <p className="text-sm text-slate-300">Discover trending topics and proven formats.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-indigo-700/80 rounded-full p-2">
              <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" /><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
            </span>
            <div>
              <h3 className="font-semibold text-slate-100">Ready to Use</h3>
              <p className="text-sm text-slate-300">Copy, edit, and publish with zero hassle.</p>
            </div>
          </div>
        </div>
        {/* Call to action */}
        <Link
          href="/generate"
          className="inline-block px-6 py-3 rounded-lg bg-linear-to-r from-sky-500 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.03] transition-transform"
        >
          Get Started
        </Link>
      </div>
      {/* Footer */}
      <footer className="mt-8 text-xs text-slate-400 text-center">
        &copy; {new Date().getFullYear()} Content AI. Empowering creators with intelligent tools.
      </footer>
    </div>
  )
}
