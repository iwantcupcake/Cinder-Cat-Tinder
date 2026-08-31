'use client';

import { useState, useEffect } from 'react';
import SwipeDeck from '@/components/SwipeDeck';
import { getCatDeckClient } from '@/lib/catImages';
import { Database } from '@/types/database';

export default function AppPage() {
  const [cats, setCats] = useState<Database['public']['Tables']['cat_images']['Row'][]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCats = async () => {
    setIsLoading(true);
    try {
      const catDeck = await getCatDeckClient(10);
      setCats(catDeck);
    } catch (error) {
      console.error('Failed to load cats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCats();
  }, []);

  const handleRefresh = () => {
    loadCats();
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1F1F1F] mb-2">Discover Cats</h1>
          <p className="text-[#1F1F1F] opacity-70">Swipe right to like, left to pass</p>
        </div>

        {isLoading && cats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[600px]">
            <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#1F1F1F] opacity-70">Loading cats...</p>
          </div>
        ) : (
          <SwipeDeck cats={cats} onRefresh={handleRefresh} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
