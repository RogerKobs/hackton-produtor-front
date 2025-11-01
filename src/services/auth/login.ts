import { supabase } from '@/lib/supabase/client';
import type { IUser } from '@/@types/IUser';

export const login = async (name: string): Promise<IUser> => {
  const { data: producerData, error: producerError } = await supabase
    .from('producers')
    .select('*')
    .eq('name', name)
    .maybeSingle();

  if (!producerError && producerData) {
    return {
      ...producerData,
      type: 'producer' as const,
    };
  }

  const { data: technicianData, error: technicianError } = await supabase
    .from('technicians')
    .select('*')
    .eq('name', name)
    .maybeSingle();

  if (technicianError || !technicianData) {
    throw new Error('Usuário não encontrado');
  }

  return {
    ...technicianData,
    type: 'technician' as const,
  };
};
