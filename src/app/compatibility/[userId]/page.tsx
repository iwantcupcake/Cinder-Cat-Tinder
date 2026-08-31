import { createBrowserClient } from '@/lib/supabaseClient';
import { computeCompatibilityScore } from '@/lib/compatibility';
import CopyLinkButton from './CopyLinkButton';
import { Heart, X, ArrowRight } from 'lucide-react';

interface CompatibilityPageProps {
  params: {
    userId: string;
  };
}

export default async function CompatibilityPage({ params }: CompatibilityPageProps) {
  const supabase = createBrowserClient();
  const targetUserId = params.userId;

  // Get current user
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1F1F1F] mb-4">Authentication Required</h1>
          <p className="text-[#1F1F1F] opacity-70 mb-6">Please log in to view compatibility</p>
          <a
            href="/login"
            className="inline-block bg-gradient-to-r from-[#FF6B35] to-[#FF4E7A] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Log in
          </a>
        </div>
      </div>
    );
  }

  // Compute compatibility score
  const compatibility = await computeCompatibilityScore(currentUser.id, targetUserId);

  const isSelf = currentUser.id === targetUserId;

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1F1F1F] mb-2">Cat Taste Compatibility</h1>
            <p className="text-[#1F1F1F] opacity-70">
              {isSelf
                ? 'Open this link on a friend\'s device to check your compatibility'
                : `See how compatible your cat tastes are`}
            </p>
          </div>

          {/* Score Display */}
          <div className="mb-8">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <defs>
                  <linearGradient id="tinder-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B35" />
                    <stop offset="100%" stopColor="#FF4E7A" />
                  </linearGradient>
                </defs>
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke={compatibility.score >= 70 ? 'url(#tinder-gradient)' : compatibility.score >= 40 ? '#00C2B3' : '#6b7280'}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - compatibility.score / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl font-bold text-[#1F1F1F]">{compatibility.score}</span>
                  <span className="text-2xl text-[#1F1F1F] opacity-70">%</span>
                </div>
              </div>
            </div>
            <p className="text-center text-lg text-[#1F1F1F] font-medium mb-2">
              {compatibility.score >= 80 ? 'Excellent Match!' : 
               compatibility.score >= 60 ? 'Good Compatibility' :
               compatibility.score >= 40 ? 'Some Common Ground' : 'Different Tastes'}
            </p>
            <p className="text-center text-sm text-[#1F1F1F] opacity-70">
              {compatibility.explanation}
            </p>
          </div>

          {/* What you both like */}
          {(compatibility.overlappingBreeds.length > 0 || 
            compatibility.overlappingColors.length > 0 || 
            compatibility.overlappingTags.length > 0) && (
            <div className="mb-8 p-6 bg-green-50 rounded-2xl">
              <h2 className="text-lg font-semibold text-[#1F1F1F] mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-500" />
                What you both like
              </h2>
              <div className="space-y-3">
                {compatibility.overlappingBreeds.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[#1F1F1F] opacity-70 mb-2">Breeds:</p>
                    <div className="flex flex-wrap gap-2">
                      {compatibility.overlappingBreeds.map((breed) => (
                        <span key={breed} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {breed}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {compatibility.overlappingColors.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[#1F1F1F] opacity-70 mb-2">Colors:</p>
                    <div className="flex flex-wrap gap-2">
                      {compatibility.overlappingColors.map((color) => (
                        <span key={color} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {compatibility.overlappingTags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[#1F1F1F] opacity-70 mb-2">Traits:</p>
                    <div className="flex flex-wrap gap-2">
                      {compatibility.overlappingTags.slice(0, 5).map((tag) => (
                        <span key={tag} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#FF6B35] to-[#FF4E7A] bg-opacity-10 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-[#FF6B35]" />
                <span className="text-2xl font-bold text-[#1F1F1F]">{compatibility.commonLikes.length}</span>
              </div>
              <p className="text-sm text-[#1F1F1F] opacity-70">Common likes</p>
            </div>
            <div className="bg-red-50 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <X className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold text-[#1F1F1F]">{compatibility.commonDislikes.length}</span>
              </div>
              <p className="text-sm text-[#1F1F1F] opacity-70">Common dislikes</p>
            </div>
          </div>

          {/* Copy link button */}
          <CopyLinkButton currentUserId={currentUser.id} />
        </div>

        {/* Back to app */}
        <div className="text-center mt-6">
          <a
            href="/app"
            className="inline-flex items-center gap-2 text-[#FF6B35] hover:underline font-medium"
          >
            Back to swiping
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
