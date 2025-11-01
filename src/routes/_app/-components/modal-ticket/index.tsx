import { useEffect } from 'react';
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

import { Calendar, UserCircle, Clock } from 'lucide-react';
import { useTicketModalStore, type Ticket } from '@/stores/ticket-modal-store';
import { FormProvider, useForm } from 'react-hook-form';
import { STATUS_COLORS, STATUS_LABELS, CATEGORY_OPTIONS } from './options';

import { Input } from '@/components/shared/Input';
import { Textarea } from '@/components/shared/Textarea';
import { Autocomplete } from '@/components/shared/Autocomplete';

import { useUserStore } from '@/stores/user-store';
import { formatDate } from '@/utils/format-string';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useCreateTicket } from '@/services/tickets/use-create-ticket';
import { useUpdateTicket } from '@/services/tickets/use-update-ticket';
import { useListTickets as listTickets } from '@/services/tickets/use-list-tickets';

export function ModalTicket() {
  const { isOpen, selectedTicket, closeModal } = useTicketModalStore();
  const isEditMode = !!selectedTicket;

  const { user } = useUserStore();

  const form = useForm<Ticket>({
    defaultValues: {
      title: '',
      category: '',
      description: '',
    },
  });
  const { setValue, handleSubmit, reset } = form;

  useEffect(() => {
    if (selectedTicket) {
      setValue('title', selectedTicket.title);
      setValue('category', selectedTicket.category);
      setValue('description', selectedTicket.description);
    } else {
      reset();
    }
  }, [selectedTicket, isOpen, setValue, reset]);

  const { refetch: refetchTickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => listTickets(user?.id ?? ''),
  });

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

  const onSubmit = async ({ title, category, description }: Ticket) => {
    if (isEditMode) {
      await updateTicket({
        id: selectedTicket?.id ?? 0,
        title,
        category,
        description,
      });
    } else {
      await createTicket({
        title,
        category,
        description,
        status: 'pending',
        id_producers: user?.id ?? '',
      });
    }
    refetchTickets();
    closeModal();

    if (!isEditMode) {
      reset();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Detalhes do Chamado' : 'Novo Chamado'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Visualize e edite as informações do chamado.'
              : 'Preencha os dados abaixo para criar um novo chamado.'}
          </DialogDescription>
        </DialogHeader>

        {isEditMode && selectedTicket && (
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
                    className='text-xs border-transparent'
                    style={{
                      backgroundColor:
                        STATUS_COLORS[selectedTicket.status]?.bg || '#008f35',
                      color:
                        STATUS_COLORS[selectedTicket.status]?.text || '#ffffff',
                    }}
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
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <FormProvider {...form}>
            <Input
              name='title'
              label='Título'
              placeholder='Digite o título do chamado'
              disabled={isEditMode && selectedTicket?.status !== 'pending'}
            />

            <div className='space-y-2'>
              <Autocomplete
                name='category'
                label='Categoria'
                options={CATEGORY_OPTIONS}
                disabled={isEditMode && selectedTicket?.status !== 'pending'}
              />
            </div>

            <div className='space-y-2'>
              <Textarea
                name='description'
                label='Descrição'
                rows={4}
                placeholder='Descreva o problema ou necessidade...'
                disabled={isEditMode && selectedTicket?.status !== 'pending'}
              />
            </div>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={closeModal}>
                {isEditMode ? 'Fechar' : 'Cancelar'}
              </Button>

              <Button type='submit'>
                {isEditMode ? 'Salvar Alterações' : 'Criar Chamado'}
              </Button>
            </DialogFooter>
          </FormProvider>
        </form>
      </DialogContent>
    </Dialog>
  );
}
