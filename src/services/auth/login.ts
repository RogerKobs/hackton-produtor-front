import { supabase } from '@/lib/supabase/client';
import type { IUser } from '@/@types/IUser';

export const login = async (name: string): Promise<IUser> => {
  const { data, error } = await supabase
    .from('producers')
    .select('*')
    .eq('name', name);

  if (error) {
    throw error;
  }

  return data[0];
};
