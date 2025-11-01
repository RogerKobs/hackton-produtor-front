import { supabase } from '@/lib/supabase/client';

export const useListTickets = async (producer_id: string) => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id_producers', producer_id);

  if (error) {
    throw error;
  }

  return data;
};
