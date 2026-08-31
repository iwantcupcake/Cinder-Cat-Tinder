'use server';

import { createBrowserClient } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

export async function recordSwipe(catImageId: string, direction: 'like' | 'nope') {
  const supabase = createBrowserClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase.from('swipes').insert({
    user_id: user.id,
    cat_image_id: catImageId,
    direction,
  });

  if (error) {
    throw new Error(`Failed to record swipe: ${error.message}`);
  }

  revalidatePath('/app');
}

export async function getUserSwipes() {
  const supabase = createBrowserClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('swipes')
    .select('cat_image_id, direction')
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Failed to fetch user swipes: ${error.message}`);
  }

  return data;
}

export async function hasUserSwiped(catImageId: string): Promise<boolean> {
  const supabase = createBrowserClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('swipes')
    .select('id')
    .eq('user_id', user.id)
    .eq('cat_image_id', catImageId)
    .single();

  if (error) {
    return false;
  }

  return !!data;
}
