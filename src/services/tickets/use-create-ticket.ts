import { supabase } from '@/lib/supabase/client';
import type { Ticket } from '@/stores/ticket-modal-store';

export const useCreateTicket = async (ticket: Omit<Ticket, 'id'>) => {
  const { data, error } = await supabase.from('tickets').insert(ticket);

  if (error) {
    throw error;
  }

  return data;
};
