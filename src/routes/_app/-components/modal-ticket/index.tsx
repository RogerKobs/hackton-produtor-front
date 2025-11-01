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
import { STATUS_VARIANTS, STATUS_LABELS, CATEGORY_OPTIONS } from './options';
import { Textarea } from '@/components/shared/Textarea';
import { Autocomplete } from '@/components/shared/Autocomplete';

export function ModalTicket() {
  const { isOpen, selectedTicket, closeModal } = useTicketModalStore();
  const isEditMode = !!selectedTicket;

  const form = useForm<Ticket>({
    defaultValues: {
      category: '',
      description: '',
    },
  });
  const { setValue, handleSubmit, reset } = form;

  useEffect(() => {
    if (selectedTicket) {
      setValue('category', selectedTicket.category);
      setValue('description', selectedTicket.description);
    } else {
      reset();
    }
  }, [selectedTicket, isOpen, setValue, reset]);

  const onSubmit = ({ category, description }: Ticket) => {
    if (isEditMode) {
      console.log('Atualizar chamado:', selectedTicket?.id, {
        category,
        description,
      });
    } else {
      console.log('Criar chamado:', {
        category,
        description,
      });
    }

    // closeModal();

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
                    variant={
                      STATUS_VARIANTS[selectedTicket.status] || 'default'
                    }
                    className='text-xs'
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
                  <span>
                    {new Date(selectedTicket.created_at).toLocaleDateString(
                      'pt-BR',
                      {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                  </span>
                </div>
              </div>

              {selectedTicket.scheduling_at && (
                <div className='space-y-1'>
                  <label className='text-xs font-medium text-muted-foreground'>
                    Data Agendada
                  </label>

                  <div className='flex items-center gap-1.5 text-sm'>
                    <Clock className='h-4 w-4 text-muted-foreground' />

                    <span>
                      {new Date(
                        selectedTicket.scheduling_at,
                      ).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
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
            <div className='space-y-2'>
              <Autocomplete
                name='category'
                label='Categoria'
                options={CATEGORY_OPTIONS}
              />
            </div>

            <div className='space-y-2'>
              <Textarea
                name='description'
                label='Descrição'
                rows={4}
                placeholder='Descreva o problema ou necessidade...'
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
