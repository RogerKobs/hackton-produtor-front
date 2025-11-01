import { supabase } from '@/lib/supabase/client';

interface CreateTicketProps {
  title: string;
  category: string;
  description: string;
  status: string;
  id_producers: string;
}

export const useCreateTicket = async (ticket: CreateTicketProps) => {
  const { data, error } = await supabase.from('tickets').insert(ticket);

  if (error) {
    throw error;
  }

  return data;
};
