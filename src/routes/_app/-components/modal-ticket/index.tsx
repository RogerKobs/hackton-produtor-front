import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { Calendar, UserCircle, Clock } from 'lucide-react';
import { useTicketModalStore, type Ticket } from '@/stores/ticket-modal-store';
import { FormProvider, useForm } from 'react-hook-form';
import { STATUS_COLORS, STATUS_LABELS, CATEGORY_OPTIONS } from './options';
import { cn } from '@/lib/utils';

import { Input } from '@/components/shared/Input';
import { Autocomplete } from '@/components/shared/Autocomplete';
import { Textarea as SharedTextarea } from '@/components/shared/Textarea';

import { useUserStore } from '@/stores/user-store';
import { formatDate } from '@/utils/format-string';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useCreateTicket } from '@/services/tickets/use-create-ticket';
import { useUpdateTicket } from '@/services/tickets/use-update-ticket';
import { useListTickets as listTickets } from '@/services/tickets/use-list-tickets';
import { useUpdateTicketStatus } from '@/services/tickets/use-update-ticket-status';
import { useAddComment } from '@/services/tickets/use-add-comment';

export function ModalTicket() {
  const { isOpen, selectedTicket, closeModal, updateSelectedTicket } =
    useTicketModalStore();
  const isEditMode = !!selectedTicket;
  const [comment, setComment] = useState('');

  const { user } = useUserStore();
  const isTechnician = user?.type === 'technician';

  const form = useForm<Ticket>({
    defaultValues: {
      title: '',
      category: '',
      description: '',
    },
  });
  const { setValue, handleSubmit, reset } = form;

  const { refetch: refetchTickets } = useQuery({
    queryKey: ['tickets', user?.id],
    queryFn: () => listTickets(user),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (selectedTicket) {
      setValue('title', selectedTicket.title);
      setValue('category', selectedTicket.category);
      setValue('description', selectedTicket.description);
    } else {
      reset();
    }
    setComment('');
  }, [selectedTicket, setValue, reset]);

  useEffect(() => {
    if (selectedTicket && isOpen) {
      const fetchUpdatedTicket = async () => {
        await refetchTickets();
        const updatedTickets = await listTickets(user);
        const updatedTicket = updatedTickets?.find(
          (t) => t.id === selectedTicket.id,
        );
        if (updatedTicket) {
          updateSelectedTicket(updatedTicket);
        }
      };

      fetchUpdatedTicket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTicket?.id, isOpen]);

  const { mutateAsync: createTicket } = useMutation({
    mutationKey: ['createTicket'],
    mutationFn: useCreateTicket,
    onSuccess: () => {
      closeModal();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutateAsync: updateTicket } = useMutation({
    mutationKey: ['updateTicket'],
    mutationFn: useUpdateTicket,
    onSuccess: () => {
      closeModal();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutateAsync: updateTicketStatus, isPending: isUpdatingStatus } =
    useMutation({
      mutationKey: ['updateTicketStatus'],
      mutationFn: useUpdateTicketStatus,
      onSuccess: async (updatedTicket) => {
        if (updatedTicket) {
          updateSelectedTicket(updatedTicket);
        }
        await refetchTickets();
        const updatedTickets = await listTickets(user);
        const freshTicket = updatedTickets?.find(
          (t) => t.id === selectedTicket?.id,
        );
        if (freshTicket) {
          updateSelectedTicket(freshTicket);
        }
      },
      onError: (error) => {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao atualizar status do ticket. Tente novamente.');
      },
    });

  const { mutateAsync: addComment } = useMutation({
    mutationKey: ['addComment'],
    mutationFn: useAddComment,
    onSuccess: async () => {
      await refetchTickets();
      const updatedTickets = await listTickets(user);
      const updatedTicket = updatedTickets?.find(
        (t) => t.id === selectedTicket?.id,
      );
      if (updatedTicket) {
        updateSelectedTicket({ comments: updatedTicket.comments });
      }
      setComment('');
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async ({ title, category, description }: Ticket) => {
    if (isEditMode) {
      await updateTicket({
        id: selectedTicket?.id ?? 0,
        title,
        category,
        description,
      });
      await refetchTickets();
      const updatedTickets = await listTickets(user);
      const updatedTicket = updatedTickets?.find(
        (t) => t.id === selectedTicket?.id,
      );
      if (updatedTicket) {
        updateSelectedTicket(updatedTicket);
      }
    } else {
      await createTicket({
        title,
        category,
        description,
        status: 'pending',
        id_producers: user?.id ?? '',
      });
    }
    await refetchTickets();
    closeModal();

    if (!isEditMode) {
      reset();
    }
  };

  const handleStartService = async () => {
    if (!selectedTicket || !user) return;

    await updateTicketStatus({
      id: selectedTicket.id,
      status: 'in_progress',
    });
  };

  const handleCompleteService = async () => {
    if (!selectedTicket) return;

    await updateTicketStatus({
      id: selectedTicket.id,
      status: 'completed',
    });
  };

  const handleAddComment = async () => {
    if (!selectedTicket || !comment.trim()) return;

    await addComment({
      ticketId: selectedTicket.id,
      comment: comment.trim(),
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  const canStartService =
    isTechnician &&
    selectedTicket &&
    (selectedTicket.status === 'pending' ||
      selectedTicket.status === 'scheduled');
  const canCompleteService =
    isTechnician && selectedTicket && selectedTicket.status === 'in_progress';
  const canAddComments =
    isTechnician && selectedTicket && selectedTicket.status === 'in_progress';
  const canEdit =
    !isTechnician && selectedTicket && selectedTicket.status === 'pending';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Detalhes do Chamado' : 'Novo Chamado'}
          </DialogTitle>
          <DialogDescription>
            {isTechnician
              ? 'Visualize as informações do chamado e gerencie o atendimento.'
              : isEditMode
              ? 'Visualize e edite as informações do chamado.'
              : 'Preencha os dados abaixo para criar um novo chamado.'}
          </DialogDescription>
        </DialogHeader>

        {isEditMode && selectedTicket && (
          <>
            <div className='space-y-4 rounded-lg border bg-muted/30 p-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-xs font-medium text-muted-foreground'>
                    ID do Chamado
                  </label>
                  <p className='text-sm font-medium'>#{selectedTicket.id}</p>
                </div>

                <div className='space-y-1'>
                  <label className='text-xs font-medium text-muted-foreground'>
                    Status
                  </label>
                  <div>
                    <Badge
                      className={cn(
                        'text-xs',
                        STATUS_COLORS[selectedTicket.status] ||
                          'bg-[#008f35] text-white border-transparent',
                      )}
                    >
                      {STATUS_LABELS[selectedTicket.status] ||
                        selectedTicket.status}
                    </Badge>
                  </div>
                </div>

                <div className='space-y-1'>
                  <label className='text-xs font-medium text-muted-foreground'>
                    Data de Criação
                  </label>
                  <div className='flex items-center gap-1.5 text-sm'>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                    <span>{formatDate(selectedTicket.created_at)}</span>
                  </div>
                </div>

                {selectedTicket.scheduling_at && (
                  <div className='space-y-1'>
                    <label className='text-xs font-medium text-muted-foreground'>
                      Data Agendada
                    </label>
                    <div className='flex items-center gap-1.5 text-sm'>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      <span>{formatDate(selectedTicket.scheduling_at)}</span>
                    </div>
                  </div>
                )}

                {selectedTicket.technician_name && (
                  <div className='space-y-1 col-span-2'>
                    <label className='text-xs font-medium text-muted-foreground'>
                      Técnico Responsável
                    </label>
                    <div className='flex items-center gap-1.5 text-sm'>
                      <UserCircle className='h-4 w-4 text-muted-foreground' />
                      <span>{selectedTicket.technician_name}</span>
                    </div>
                  </div>
                )}

                {isTechnician && (
                  <>
                    <div className='space-y-1 col-span-2'>
                      <label className='text-xs font-medium text-muted-foreground'>
                        Título
                      </label>
                      <p className='text-sm'>{selectedTicket.title}</p>
                    </div>

                    <div className='space-y-1 col-span-2'>
                      <label className='text-xs font-medium text-muted-foreground'>
                        Categoria
                      </label>
                      <p className='text-sm'>
                        {CATEGORY_OPTIONS.find(
                          (c) => c.value === selectedTicket.category,
                        )?.label || selectedTicket.category}
                      </p>
                    </div>

                    <div className='space-y-1 col-span-2'>
                      <label className='text-xs font-medium text-muted-foreground'>
                        Descrição
                      </label>
                      <p className='text-sm whitespace-pre-wrap'>
                        {selectedTicket.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {selectedTicket.comments && (
              <div className='space-y-2'>
                <label className='text-xs font-medium text-muted-foreground'>
                  Comentários do Atendimento
                </label>
                <div className='text-sm whitespace-pre-wrap bg-background border rounded-md p-3 max-h-48 overflow-y-auto'>
                  {selectedTicket.comments}
                </div>
              </div>
            )}

            {canAddComments && (
              <div className='space-y-2'>
                <Label htmlFor='comment'>Adicionar Comentário</Label>
                <Textarea
                  id='comment'
                  placeholder='Descreva o que está sendo realizado no atendimento...'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleAddComment}
                  disabled={!comment.trim()}
                >
                  Adicionar Comentário
                </Button>
              </div>
            )}
          </>
        )}

        {!isTechnician && (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <FormProvider {...form}>
              <Input
                name='title'
                label='Título'
                placeholder='Digite o título do chamado'
                disabled={isEditMode && !canEdit}
              />

              <div className='space-y-2'>
                <Autocomplete
                  name='category'
                  label='Categoria'
                  options={CATEGORY_OPTIONS}
                  disabled={isEditMode && !canEdit}
                />
              </div>

              <div className='space-y-2'>
                <SharedTextarea
                  name='description'
                  label='Descrição'
                  rows={4}
                  placeholder='Descreva o problema ou necessidade...'
                  disabled={isEditMode && !canEdit}
                />
              </div>

              <DialogFooter>
                <Button type='button' variant='outline' onClick={closeModal}>
                  {isEditMode ? 'Fechar' : 'Cancelar'}
                </Button>

                {(!isEditMode || canEdit) && (
                  <Button type='submit'>
                    {isEditMode ? 'Salvar Alterações' : 'Criar Chamado'}
                  </Button>
                )}
              </DialogFooter>
            </FormProvider>
          </form>
        )}

        {isTechnician && (
          <DialogFooter className='flex gap-2'>
            {canStartService && (
              <Button
                type='button'
                onClick={handleStartService}
                className='flex-1'
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? 'Atualizando...' : 'Iniciar Atendimento'}
              </Button>
            )}

            {canCompleteService && (
              <Button
                type='button'
                onClick={handleCompleteService}
                className='flex-1'
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? 'Concluindo...' : 'Concluir Atendimento'}
              </Button>
            )}

            <Button type='button' variant='outline' onClick={closeModal}>
              Fechar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
