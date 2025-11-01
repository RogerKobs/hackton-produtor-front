import type { Ticket } from '@/stores/ticket-modal-store';
import { supabase } from '@/lib/supabase/client';

interface UpdateTicketStatusProps {
  id: number;
  status: string;
  technician_id?: string;
  technician_name?: string;
}

export const useUpdateTicketStatus = async ({
  id,
  status,
  technician_id,
  technician_name,
}: UpdateTicketStatusProps) => {
  const updateData: Partial<Ticket> = {
    status,
  };

  if (technician_id) {
    updateData.id_technicians = technician_id;
  }

  if (technician_name) {
    updateData.technician_name = technician_name;
  }

  const { data, error } = await supabase
    .from('tickets')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

