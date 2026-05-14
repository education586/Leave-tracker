import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('d.gupta@chelsongordon.com');
  const [password, setPassword] = useState('Lucky1016@');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'd.gupta@chelsongordon.com' && password === 'Lucky1016@') {
      setError('');
      onLogin();
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white w-full max-w-[1080px] flex rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden min-h-[640px] mx-auto border border-slate-100">
        
        {/* Left Panel - Illustration */}
        <div className="w-1/2 lg:w-[50%] hidden md:block relative bg-[#f8f9fa] overflow-hidden p-3 lg:p-4">
          <div className="w-full h-full relative rounded-xl overflow-hidden shadow-sm">
             <img 
              src="https://tan-occasional-flamingo-688.mypinata.cloud/ipfs/bafybeihti4cuhajomzgkwwcouzlsgtmtlqopmkzfsmlmnrmrd4cqyqr3qa/Screenshot_13-5-2026_8307_unsplash.com.jpeg" 
              alt="Leave Tracker image" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 lg:w-[50%] p-10 lg:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-[400px] w-full mx-auto md:ml-8 lg:ml-12">
            <h1 className="text-4xl font-bold text-[#0e2a47] tracking-tight mb-3">Welcome back</h1>
            <p className="text-base text-slate-500 mb-10 leading-relaxed font-medium">
              Welcome to the Leave Tracker platform.<br />
              Log in to your account to continue.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl font-medium border border-red-100/50">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-base font-medium text-[#0e2a47] block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-base text-slate-900 focus:border-[#0e2a47] focus:ring-4 focus:ring-[#0e2a47]/10 focus:bg-white outline-none transition-all placeholder-slate-400 font-medium"
                   placeholder="name@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-[#0e2a47] block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-base text-slate-900 tracking-widest focus:border-[#0e2a47] focus:ring-4 focus:ring-[#0e2a47]/10 focus:bg-white outline-none transition-all placeholder-slate-400 font-medium"
                   placeholder="••••••••••••"
                  required
                />
              </div>

              <div className="flex items-center pt-2 pb-5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input type="checkbox" className="peer w-full h-full appearance-none rounded-[4px] bg-slate-50 border border-slate-300 checked:bg-[#0e2a47] checked:border-[#0e2a47] transition-all cursor-pointer" defaultChecked />
                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 5.5L5 9L12.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-base font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0e2a47] text-white py-4 rounded-xl text-base font-bold tracking-wide hover:bg-[#0a386b] hover:shadow-lg hover:shadow-[#0e2a47]/20 transition-all active:scale-[0.98]"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
