import { supabase } from '@/lib/supabase/client';

export const seed = async () => {
  const { data, error } = await supabase.from('producers').insert({
    name: 'Roger',
    cellphone: '99999',
    address: 'Rua do Roger',
    production: JSON.stringify(['Tomate', 'Cenoura', 'Batata']),
  });

  return { data, error };
};
