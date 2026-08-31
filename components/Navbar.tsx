'use client';

import { createBrowserClient } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { logout } from '@/actions/authActions';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#tinder-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="tinder-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#FF4E7A" />
                </linearGradient>
              </defs>
              <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3.1-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.67.26 6.43 2.26.64-.17 1.33-.26 2-.26z"/>
            </svg>
            <span className="text-xl font-bold text-[#1F1F1F]">Cinder</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/app" className="text-[#1F1F1F] hover:text-[#FF6B35] transition-colors">
                  Swipe
                </Link>
                <Link href="/profile" className="text-[#1F1F1F] hover:text-[#FF6B35] transition-colors">
                  Profile
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF4E7A] flex items-center justify-center text-white font-semibold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-[#1F1F1F] hover:text-[#FF6B35] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[#1F1F1F] hover:text-[#FF6B35] transition-colors">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-[#FF6B35] to-[#FF4E7A] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
