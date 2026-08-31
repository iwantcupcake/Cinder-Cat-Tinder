import { createServiceClient } from './supabaseClient';
import { Database } from '@/types/database';

interface SwipeData {
  cat_image_id: string;
  direction: 'like' | 'nope';
}

interface CatImageData {
  id: string;
  breed: string | null;
  color: string | null;
  tags: any;
}

interface CompatibilityResult {
  score: number;
  explanation: string;
  commonLikes: string[];
  commonDislikes: string[];
  overlappingBreeds: string[];
  overlappingColors: string[];
  overlappingTags: string[];
}

export async function computeCompatibilityScore(
  userAId: string,
  userBId: string
): Promise<CompatibilityResult> {
  const supabase = createServiceClient();

  // Fetch swipes for both users
  const [{ data: swipesA }, { data: swipesB }] = await Promise.all([
    supabase
      .from('swipes')
      .select('cat_image_id, direction')
      .eq('user_id', userAId),
    supabase
      .from('swipes')
      .select('cat_image_id, direction')
      .eq('user_id', userBId),
  ]);

  if (!swipesA || !swipesB) {
    return {
      score: 0,
      explanation: 'Not enough data to calculate compatibility',
      commonLikes: [],
      commonDislikes: [],
      overlappingBreeds: [],
      overlappingColors: [],
      overlappingTags: [],
    };
  }

  // Create maps for quick lookup
  const swipeMapA = new Map(swipesA.map((s: SwipeData) => [s.cat_image_id, s.direction]));
  const swipeMapB = new Map(swipesB.map((s: SwipeData) => [s.cat_image_id, s.direction]));

  // Find common cats
  const commonCatIds = new Set([
    ...swipeMapA.keys(),
    ...swipeMapB.keys(),
  ]);

  let agreementSum = 0;
  let totalCommon = 0;
  const commonLikes: string[] = [];
  const commonDislikes: string[] = [];

  // Fetch cat images for common cats
  const catIds = Array.from(commonCatIds);
  const { data: catImages } = await supabase
    .from('cat_images')
    .select('id, breed, color, tags')
    .in('id', catIds);

  const catImageMap = new Map<string, CatImageData>();
  catImages?.forEach((cat: any) => {
    catImageMap.set(cat.id, {
      id: cat.id,
      breed: cat.breed,
      color: cat.color,
      tags: Array.isArray(cat.tags) ? cat.tags : [],
    });
  });

  // Calculate agreement for common cats
  for (const catId of commonCatIds) {
    const directionA = swipeMapA.get(catId);
    const directionB = swipeMapB.get(catId);

    if (directionA && directionB) {
      totalCommon++;
      if (directionA === directionB) {
        if (directionA === 'like') {
          agreementSum += 1;
          commonLikes.push(catId);
        } else {
          agreementSum += 1;
          commonDislikes.push(catId);
        }
      } else {
        agreementSum -= 1;
      }
    }
  }

  // Calculate swipe agreement score
  let agreementScore = 0;
  if (totalCommon > 0) {
    agreementScore = ((agreementSum + totalCommon) / (2 * totalCommon)) * 100;
  }

  // Build preference sets for tag similarity
  const likedCatsA = swipesA
    .filter((s: any) => s.direction === 'like')
    .map((s: any) => catImageMap.get(s.cat_image_id))
    .filter((cat): cat is CatImageData => cat !== undefined);

  const likedCatsB = swipesB
    .filter((s: any) => s.direction === 'like')
    .map((s: any) => catImageMap.get(s.cat_image_id))
    .filter((cat): cat is CatImageData => cat !== undefined);

  // Extract preferences
  const breedsA = new Set(likedCatsA.map((cat) => cat.breed).filter((b): b is string => b !== null));
  const breedsB = new Set(likedCatsB.map((cat) => cat.breed).filter((b): b is string => b !== null));

  const colorsA = new Set(likedCatsA.map((cat) => cat.color).filter((c): c is string => c !== null));
  const colorsB = new Set(likedCatsB.map((cat) => cat.color).filter((c): c is string => c !== null));

  const tagsA = new Set(likedCatsA.flatMap((cat) => cat.tags));
  const tagsB = new Set(likedCatsB.flatMap((cat) => cat.tags));

  // Calculate Jaccard similarity for each attribute type
  const calculateJaccard = (setA: Set<string>, setB: Set<string>): number => {
    if (setA.size === 0 && setB.size === 0) return 0;
    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size > 0 ? intersection.size / union.size : 0;
  };

  const breedSimilarity = calculateJaccard(breedsA, breedsB);
  const colorSimilarity = calculateJaccard(colorsA, colorsB);
  const tagSimilarity = calculateJaccard(tagsA, tagsB);

  // Combined tag similarity (average of all attribute types)
  const combinedTagSimilarity = ((breedSimilarity + colorSimilarity + tagSimilarity) / 3) * 100;

  // Find overlapping attributes
  const overlappingBreeds = [...new Set([...breedsA].filter((b) => breedsB.has(b)))];
  const overlappingColors = [...new Set([...colorsA].filter((c) => colorsB.has(c)))];
  const overlappingTags = [...new Set([...tagsA].filter((t) => tagsB.has(t)))];

  // Final score: 70% agreement, 30% tag similarity
  const finalScore = Math.round(
    Math.max(0, Math.min(100, 0.7 * agreementScore + 0.3 * combinedTagSimilarity))
  );

  // Generate explanation
  let explanation = '';
  if (totalCommon === 0) {
    explanation = 'Not enough common cats to determine compatibility';
  } else if (finalScore >= 80) {
    explanation = `You both have excellent taste in cats! You agreed on ${commonLikes.length + commonDislikes.length} out of ${totalCommon} cats.`;
  } else if (finalScore >= 60) {
    explanation = `You have good compatibility. You agreed on ${commonLikes.length + commonDislikes.length} out of ${totalCommon} cats.`;
  } else if (finalScore >= 40) {
    explanation = `You have some common preferences but also notable differences.`;
  } else {
    explanation = `Your cat tastes are quite different. You agreed on only ${commonLikes.length + commonDislikes.length} out of ${totalCommon} cats.`;
  }

  if (overlappingBreeds.length > 0) {
    explanation += ` You both like ${overlappingBreeds.slice(0, 2).join(' and ')} cats.`;
  }

  return {
    score: finalScore,
    explanation,
    commonLikes,
    commonDislikes,
    overlappingBreeds,
    overlappingColors,
    overlappingTags,
  };
}
