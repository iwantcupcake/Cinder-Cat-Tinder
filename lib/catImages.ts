import { createServiceClient } from './supabaseClient';
import { Database } from '@/types/database';

type CatImage = Database['public']['Tables']['cat_images']['Insert'];

interface TheCatAPIResponse {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds?: Array<{
    name: string;
    temperament?: string;
  }>;
}

export async function fetchAndSeedCatImages(limit: number): Promise<number> {
  const supabase = createServiceClient();
  const apiKey = process.env.THECATAPI_KEY;
  
  if (!apiKey) {
    throw new Error('THECATAPI_KEY environment variable is not set');
  }

  let insertedCount = 0;

  try {
    // Fetch from TheCatAPI
    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?limit=${limit}`,
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`TheCatAPI request failed: ${response.statusText}`);
    }

    const catApiData: TheCatAPIResponse[] = await response.json();

    // Normalize and insert cat images
    for (const cat of catApiData) {
      const breed = cat.breeds?.[0]?.name || null;
      const temperament = cat.breeds?.[0]?.temperament || '';
      const tags = temperament ? temperament.split(',').map(t => t.trim()) : [];

      const catImage: CatImage = {
        url: cat.url,
        source: 'thecatapi',
        breed,
        color: null,
        tags: tags.length > 0 ? tags : [],
        width: cat.width,
        height: cat.height,
      };

      // Check if URL already exists
      const { data: existing } = await supabase
        .from('cat_images')
        .select('url')
        .eq('url', cat.url)
        .single();

      if (!existing) {
        const { error } = await supabase.from('cat_images').insert(catImage);
        if (!error) {
          insertedCount++;
        }
      }
    }

    // Fallback to CATAAS if we didn't get enough images
    if (insertedCount < limit / 2) {
      const fallbackLimit = Math.floor(limit / 2);
      for (let i = 0; i < fallbackLimit; i++) {
        const cataasUrl = `https://cataas.com/cat?${Date.now()}-${i}`;
        
        const catImage: CatImage = {
          url: cataasUrl,
          source: 'cataas',
          breed: null,
          color: null,
          tags: [],
          width: null,
          height: null,
        };

        const { data: existing } = await supabase
          .from('cat_images')
          .select('url')
          .eq('url', cataasUrl)
          .single();

        if (!existing) {
          const { error } = await supabase.from('cat_images').insert(catImage);
          if (!error) {
            insertedCount++;
          }
        }
      }
    }

    return insertedCount;
  } catch (error) {
    console.error('Error fetching and seeding cat images:', error);
    throw error;
  }
}

export async function getCatDeck(limit: number = 10) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('cat_images')
    .select('*')
    .order('random()')
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch cat deck: ${error.message}`);
  }

  return data;
}

export async function getCatDeckClient(limit: number = 10) {
  const { createBrowserClient } = await import('./supabaseClient');
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from('cat_images')
    .select('*')
    .order('random()')
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch cat deck: ${error.message}`);
  }

  return data;
}

export async function getCatImageById(id: string) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('cat_images')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch cat image: ${error.message}`);
  }

  return data;
}
