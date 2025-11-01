import { supabase } from '@/lib/supabase/client';
import type { INotification } from '@/@types/INotification';

export const useListNotification = async (
  user_id: string,
): Promise<INotification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('id_producers', user_id);

  if (error) {
    throw error;
  }

  return data;
};
