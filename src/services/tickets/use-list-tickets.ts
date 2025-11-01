import { supabase } from '@/lib/supabase/client';

export const useListTickets = async () => {
  const { data, error } = await supabase.from('tickets').select('*');

  if (error) {
    throw error;
  }

  return data;
};
