'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Mail, Lock, Eye, EyeOff, CheckSquare, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState('jalak@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    const success = login(email);
    if (success) {
      if (email.includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#FFF7F1] relative">
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center py-4">
        {/* Logo and Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#E77B52] flex items-center justify-center text-white mx-auto shadow-md shadow-[#E77B52]/20 mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-bold text-[#29201D]">Resource</span>
            <span className="text-2xl font-bold text-[#E77B52]">Hub</span>
          </div>
          <p className="text-xs font-semibold text-[#89817D] mt-1">Login to continue</p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email Address */}
          <div>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#89817D] absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-[#F2DED4] text-xs font-medium text-[#29201D] placeholder-[#B5ACA7] focus:outline-none focus:border-[#E77B52] focus:ring-2 focus:ring-[#E77B52]/20 shadow-sm"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#89817D] absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 bg-white rounded-2xl border border-[#F2DED4] text-xs font-medium text-[#29201D] placeholder-[#B5ACA7] focus:outline-none focus:border-[#E77B52] focus:ring-2 focus:ring-[#E77B52]/20 shadow-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#89817D] hover:text-[#29201D]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & forgot password */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center gap-1.5 text-[#89817D] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#E77B52] rounded"
              />
              <span>Remember Me</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Password reset instructions have been sent to your email.')}
              className="text-[#E77B52] font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#E77B52] hover:bg-[#D3683E] text-white rounded-2xl font-bold text-xs shadow-md shadow-[#E77B52]/20 transition-all active:scale-[0.98] mt-2"
          >
            Login
          </button>
        </form>

        {/* Or continue with */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#F2DED4]" />
          </div>
          <span className="relative px-3 bg-[#FFF7F1] text-[11px] text-[#89817D]">
            or continue with
          </span>
        </div>

        {/* Social / Alternate Logins */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              login('jalak@gmail.com');
              router.push('/dashboard');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#F2DED4] hover:bg-[#FFF7F1] text-[#29201D] text-xs font-semibold rounded-2xl shadow-sm transition-colors"
          >
            <span className="font-bold text-[#4285F4]">G</span>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => {
              login('jalak@gmail.com');
              router.push('/dashboard');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#F2DED4] hover:bg-[#FFF7F1] text-[#29201D] text-xs font-semibold rounded-2xl shadow-sm transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#E77B52]" />
            <span>Continue with OTP</span>
          </button>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="text-center pt-2 text-xs text-[#89817D]">
        Don't have an account?{' '}
        <Link href="/signup" className="font-bold text-[#E77B52] hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
