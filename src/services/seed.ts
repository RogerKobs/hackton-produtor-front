import { supabase } from '@/lib/supabase/client';

export const seed = async () => {
  const { data, error } = await supabase.from('users').insert({
    name: 'Roger',
    telephone: '99999',
    address: 'Rua do Roger',
  });

  return { data, error };
};
