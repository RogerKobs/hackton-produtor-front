import { supabase } from '@/lib/supabase/client';
import type { IUser } from '@/@types/IUser';

export const useListTickets = async (user: IUser | null) => {
  if (!user) {
    return [];
  }

  let query = supabase.from('tickets').select('*');

  if (user.type === 'producer') {
    query = query.eq('id_producers', user.id);
  } else if (user.type === 'technician') {
    query = query.eq('id_technicians', user.id);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
};
