'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Chrome, Check } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const [isRegister, setIsRegister] = useState(mode === 'register');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mock authentication
      if (email && password) {
        login(email);
        // Redirect handled by AuthGuard
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      // Mock Google authentication
      const name = email.split('@')[0];
      login(email, name);
    } catch (err) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#1a1815] text-[#f9f7f3] flex-col justify-center items-center px-12 relative overflow-hidden">
        <div className="absolute top-10 left-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#d4a574] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">O</span>
          </div>
          <span className="text-lg font-bold">OraQL_</span>
        </div>

        <div className="absolute top-32 right-20 deco-letter dark">O</div>

        <div className="max-w-md z-10">
          <h1 className="text-5xl font-bold mb-8">Smart Bets, Better Odds</h1>
          <p className="text-xl text-[#b8b0a5] font-light mb-12">
            OraQL_ gives you the edge you need to make confident betting decisions.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Check size={20} className="text-[#d4a574] mt-1 flex-shrink-0" />
              <p className="text-[#b8b0a5]">Real-time market analysis and live odds tracking</p>
            </div>
            <div className="flex items-start gap-3">
              <Check size={20} className="text-[#d4a574] mt-1 flex-shrink-0" />
              <p className="text-[#b8b0a5]">AI-powered predictions with confidence scores</p>
            </div>
            <div className="flex items-start gap-3">
              <Check size={20} className="text-[#d4a574] mt-1 flex-shrink-0" />
              <p className="text-[#b8b0a5]">Custom parlay builder and probability calculator</p>
            </div>
            <div className="flex items-start gap-3">
              <Check size={20} className="text-[#d4a574] mt-1 flex-shrink-0" />
              <p className="text-[#b8b0a5]">Performance tracking and advanced analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 bg-[#f9f7f3] flex flex-col justify-center items-center px-6 md:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1a1815] mb-2">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-[#3a3530] font-light">
              {isRegister
                ? 'Join OraQL_ and start making smarter bets'
                : 'Sign in to your OraQL_ account'}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            {/* Google SSO */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-[#e5dfd6] rounded-lg hover:bg-[#faf8f3] transition-colors font-medium text-[#1a1815] disabled:opacity-50"
            >
              <Chrome size={18} />
              Continue with Google
            </button>

            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-[#e5dfd6]" />
              <span className="px-3 text-sm text-[#3a3530] font-light">or</span>
              <div className="flex-grow border-t border-[#e5dfd6]" />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-[#1a1815] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-[#e5dfd6] rounded-lg focus:outline-none focus:border-[#d4a574] focus:bg-white transition-colors text-[#1a1815] placeholder-[#8a8077]"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-[#1a1815] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-[#e5dfd6] rounded-lg focus:outline-none focus:border-[#d4a574] focus:bg-white transition-colors text-[#1a1815] placeholder-[#8a8077]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a3530] hover:text-[#1a1815] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-4 py-3 bg-red-100 border border-red-300 rounded-lg text-red-900 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-[#1a1815] text-[#f9f7f3] rounded-lg hover:bg-[#2a2520] transition-colors font-medium disabled:opacity-50"
            >
              {loading
                ? 'Loading...'
                : isRegister
                  ? 'Create Account'
                  : 'Sign In'}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#3a3530] hover:text-[#1a1815] transition-colors font-light"
            >
              {isRegister
                ? 'Already have an account?'
                : 'Don't have an account?'}{' '}
              <span className="font-bold text-[#d4a574] hover:text-[#c99465]">
                {isRegister ? 'Sign In' : 'Sign Up'}
              </span>
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-8 border-t border-[#e5dfd6] flex items-center justify-between text-sm text-[#3a3530] font-light">
            <Link
              href="/"
              className="hover:text-[#d4a574] transition-colors"
            >
              Back to Home
            </Link>
            <span>
              By continuing, you agree to our{' '}
              <a href="#" className="hover:text-[#d4a574] transition-colors">
                Terms
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
