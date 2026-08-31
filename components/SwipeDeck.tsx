'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from './SwipeCard';
import { Database } from '@/types/database';
import { X, Heart, RefreshCw } from 'lucide-react';
import { recordSwipe } from '@/actions/swipeActions';

interface SwipeDeckProps {
  cats: Database['public']['Tables']['cat_images']['Row'][];
  onRefresh: () => void;
  isLoading: boolean;
}

export default function SwipeDeck({ cats, onRefresh, isLoading }: SwipeDeckProps) {
  const [cards, setCards] = useState(cats);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipe = useCallback(async (catId: string, swipeDirection: 'like' | 'nope') => {
    setDirection(swipeDirection === 'like' ? 'right' : 'left');
    
    try {
      await recordSwipe(catId, swipeDirection);
    } catch (error) {
      console.error('Failed to record swipe:', error);
    }

    setCards((prev) => prev.slice(1));
    setDirection(null);
  }, []);

  const handleNope = useCallback(() => {
    if (cards.length > 0) {
      handleSwipe(cards[0].id, 'nope');
    }
  }, [cards, handleSwipe]);

  const handleLike = useCallback(() => {
    if (cards.length > 0) {
      handleSwipe(cards[0].id, 'like');
    }
  }, [cards, handleSwipe]);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3.1-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.67.26 6.43 2.26.64-.17 1.33-.26 2-.26z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2">
          No more cats for now
        </h2>
        <p className="text-[#1F1F1F] opacity-70 mb-6">
          Check back later for more feline friends
        </p>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#FF4E7A] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px]">
      <div className="relative w-full h-full">
        <AnimatePresence>
          {cards.slice(0, 3).reverse().map((cat, index) => {
            const isTop = index === cards.slice(0, 3).length - 1;
            return (
              <motion.div
                key={cat.id}
                className="absolute w-full h-full"
                initial={{
                  scale: 0.95,
                  y: 20,
                }}
                animate={{
                  scale: isTop ? 1 : 0.95,
                  y: isTop ? 0 : 20,
                }}
                exit={{
                  x: direction === 'right' ? 1000 : direction === 'left' ? -1000 : 0,
                  rotate: direction === 'right' ? 30 : direction === 'left' ? -30 : 0,
                  opacity: 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                style={{
                  zIndex: index,
                }}
              >
                <SwipeCard
                  cat={cat}
                  onSwipe={(dir) => handleSwipe(cat.id, dir)}
                  isTop={isTop}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="absolute -bottom-24 left-0 right-0 flex justify-center gap-8">
        <motion.button
          onClick={handleNope}
          className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors border-2 border-red-200"
          disabled={!cards.length}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-10 h-10" />
        </motion.button>
        <motion.button
          onClick={handleLike}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF4E7A] shadow-2xl flex items-center justify-center text-white hover:opacity-90 transition-opacity"
          disabled={!cards.length}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className="w-10 h-10" />
        </motion.button>
      </div>
    </div>
  );
}
