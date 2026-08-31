'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyLinkButton({ currentUserId }: { currentUserId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const link = `${window.location.origin}/compatibility/${currentUserId}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
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
  );
}
