import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[#F7F7F7] font-sans">
      <main className="flex flex-1 w-full max-w-6xl flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center w-full max-w-5xl">
          {/* Left side - Hero content */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#tinder-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="tinder-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B35" />
                    <stop offset="100%" stopColor="#FF4E7A" />
                  </linearGradient>
                </defs>
                <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3.1-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.67.26 6.43 2.26.64-.17 1.33-.26 2-.26z"/>
              </svg>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F]">
                Cinder
              </h1>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1F1F1F] mb-4">
              Tinder for your cat obsession
            </h2>
            <p className="text-lg sm:text-xl text-[#1F1F1F] opacity-70 mb-8 max-w-lg">
              Swipe, match tastes, and compare your cat-taste compatibility with friends.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/app"
                className="bg-gradient-to-r from-[#FF6B35] to-[#FF4E7A] text-white py-4 px-8 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity text-center"
              >
                Start Swiping
              </Link>
            </div>
          </div>

          {/* Right side - Phone mockup */}
          <div className="flex justify-center">
            <div className="relative w-72 h-[500px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                {/* Mockup card */}
                <div className="absolute inset-4 bg-gradient-to-br from-[#FF6B35] to-[#FF4E7A] rounded-3xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
                      <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3.1-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.67.26 6.43 2.26.64-.17 1.33-.26 2-.26z"/>
                    </svg>
                    <p className="text-lg font-semibold">Swipe cats</p>
                    <p className="text-sm opacity-90">Match tastes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF4E7A] bg-opacity-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-[#1F1F1F] mb-2">Swipe & Match</h3>
            <p className="text-sm text-[#1F1F1F] opacity-70">Discover cats you love with simple swipes</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00C2B3] bg-opacity-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00C2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 className="font-semibold text-[#1F1F1F] mb-2">Compare with Friends</h3>
            <p className="text-sm text-[#1F1F1F] opacity-70">See how compatible your cat taste is with friends</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF4E7A] bg-opacity-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="font-semibold text-[#1F1F1F] mb-2">Private & Secure</h3>
            <p className="text-sm text-[#1F1F1F] opacity-70">Your data stays private with friends-only access</p>
          </div>
        </div>
      </main>
    </div>
  );
}
