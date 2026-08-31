'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Copy, Check } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);
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

  const handleCopyLink = async () => {
    if (!user) return;

    const compatibilityLink = `${window.location.origin}/compatibility/${user.id}`;
    
    try {
      await navigator.clipboard.writeText(compatibilityLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1F1F1F] opacity-70">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF4E7A] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {user.email?.[0].toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-[#1F1F1F] mb-2">Profile</h1>
            <p className="text-[#1F1F1F] opacity-70">Your Cinder account</p>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] opacity-70 mb-1">
                Email
              </label>
              <p className="text-[#1F1F1F] font-medium">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] opacity-70 mb-1">
                User ID
              </label>
              <p className="text-[#1F1F1F] font-medium text-sm">{user.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F1F1F] opacity-70 mb-1">
                Created at
              </label>
              <p className="text-[#1F1F1F] font-medium">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-[#1F1F1F] mb-4">Share your compatibility</h2>
            <p className="text-sm text-[#1F1F1F] opacity-70 mb-4">
              Share this link with friends to see how compatible your cat tastes are!
            </p>
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#FF4E7A] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy my compatibility link
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
