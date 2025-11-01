import type { Ticket } from '@/stores/ticket-modal-store';
import { supabase } from '@/lib/supabase/client';

export const useUpdateTicket = async (ticket: Partial<Ticket>) => {
  const { data, error } = await supabase
    .from('tickets')
    .update(ticket)
    .eq('id', ticket.id);

  if (error) {
    throw error;
  }

  return data;
};
