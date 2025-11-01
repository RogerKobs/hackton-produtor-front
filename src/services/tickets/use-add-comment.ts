import { supabase } from '@/lib/supabase/client';

interface AddCommentProps {
  ticketId: number;
  comment: string;
}

export const useAddComment = async ({ ticketId, comment }: AddCommentProps) => {
  const { data: ticketData, error: fetchError } = await supabase
    .from('tickets')
    .select('comments')
    .eq('id', ticketId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  const existingComments = ticketData?.comments || '';
  const newComments = existingComments
    ? `${existingComments}\n\n${new Date().toLocaleString('pt-BR')}: ${comment}`
    : `${new Date().toLocaleString('pt-BR')}: ${comment}`;

  const { data, error } = await supabase
    .from('tickets')
    .update({ comments: newComments })
    .eq('id', ticketId);

  if (error) {
    throw error;
  }

  return data;
};

