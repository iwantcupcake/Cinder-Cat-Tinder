'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Database } from '@/types/database';
import { X, Heart } from 'lucide-react';

interface SwipeCardProps {
  cat: Database['public']['Tables']['cat_images']['Row'];
  onSwipe: (direction: 'like' | 'nope') => void;
  isTop: boolean;
}

export default function SwipeCard({ cat, onSwipe, isTop }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('like');
    } else if (info.offset.x < -100) {
      onSwipe('nope');
    }
  };

  const tags = Array.isArray(cat.tags) ? cat.tags.slice(0, 3) : [];

  return (
    <motion.div
      className="absolute w-full h-full"
      style={{
        x,
        rotate,
        opacity,
        cursor: isTop ? 'grab' : 'default',
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <div className="relative w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Cat Image */}
        <div className="relative w-full h-full">
          <img
            src={cat.url}
            alt="Cat"
            className="w-full h-full object-cover"
            draggable={false}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Swipe indicators */}
          {isTop && (
            <>
              <motion.div
                className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-green-500 font-bold shadow-lg"
                style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
              >
                LIKE
              </motion.div>
              <motion.div
                className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-red-500 font-bold shadow-lg"
                style={{ opacity: useTransform(x, [0, -100], [0, 1]) }}
              >
                NOPE
              </motion.div>
            </>
          )}
          
          {/* Card content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              {cat.breed && (
                <span className="bg-[#FF6B35] px-3 py-1 rounded-full text-sm font-medium">
                  {cat.breed}
                </span>
              )}
              {cat.color && (
                <span className="bg-[#00C2B3] px-3 py-1 rounded-full text-sm font-medium">
                  {cat.color}
                </span>
              )}
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
