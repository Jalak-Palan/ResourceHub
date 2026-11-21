'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, User, Mail, Lock, Eye, EyeOff, Shield, Wrench } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/lib/types';

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    signup(fullName, email, role);
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#FFF7F1] relative">
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center py-2">
        {/* Logo and Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#E77B52] flex items-center justify-center text-white mx-auto shadow-md shadow-[#E77B52]/20 mb-2">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl font-bold text-[#29201D]">Resource</span>
            <span className="text-xl font-bold text-[#E77B52]">Hub</span>
          </div>
          <p className="text-xs font-semibold text-[#89817D] mt-0.5">Create Your Account</p>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* Full Name */}
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-[#89817D] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-[#F2DED4] text-xs font-medium text-[#29201D] placeholder-[#B5ACA7] focus:outline-none focus:border-[#E77B52] focus:ring-2 focus:ring-[#E77B52]/20 shadow-sm"
              required
            />
          </div>

          {/* Email Address */}
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-[#89817D] absolute left-3.5 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-[#F2DED4] text-xs font-medium text-[#29201D] placeholder-[#B5ACA7] focus:outline-none focus:border-[#E77B52] focus:ring-2 focus:ring-[#E77B52]/20 shadow-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#89817D] absolute left-3.5 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-2.5 bg-white rounded-2xl border border-[#F2DED4] text-xs font-medium text-[#29201D] placeholder-[#B5ACA7] focus:outline-none focus:border-[#E77B52] focus:ring-2 focus:ring-[#E77B52]/20 shadow-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-[#89817D] hover:text-[#29201D]"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#89817D] absolute left-3.5 pointer-events-none" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-[#F2DED4] text-xs font-medium text-[#29201D] placeholder-[#B5ACA7] focus:outline-none focus:border-[#E77B52] focus:ring-2 focus:ring-[#E77B52]/20 shadow-sm"
              required
            />
          </div>

          {/* Role Selection Pills matching reference image Screen 3 */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-[#89817D] mb-1.5">
              Select Role:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all relative ${
                  role === 'student'
                    ? 'bg-[#E77B52] text-white shadow-md shadow-[#E77B52]/20'
                    : 'bg-white text-[#89817D] border border-[#F2DED4] hover:bg-[#FFF7F1]'
                }`}
              >
                <span>Student</span>
                {role === 'student' && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#D3683E] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    3
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setRole('staff')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  role === 'staff'
                    ? 'bg-[#E77B52] text-white shadow-md shadow-[#E77B52]/20'
                    : 'bg-white text-[#89817D] border border-[#F2DED4] hover:bg-[#FFF7F1]'
                }`}
              >
                Staff
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  role === 'admin'
                    ? 'bg-[#E77B52] text-white shadow-md shadow-[#E77B52]/20'
                    : 'bg-white text-[#89817D] border border-[#F2DED4] hover:bg-[#FFF7F1]'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#E77B52] hover:bg-[#D3683E] text-white rounded-2xl font-bold text-xs shadow-md shadow-[#E77B52]/20 transition-all active:scale-[0.98] mt-3"
          >
            Sign Up
          </button>
        </form>
      </div>

      {/* Footer navigation */}
      <div className="text-center pt-2 text-xs text-[#89817D]">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-[#E77B52] hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
