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

export function ModalTicket() {
  const { isOpen, selectedTicket, closeModal } = useTicketModalStore();
  const isEditMode = !!selectedTicket;

  const form = useForm<Ticket>({
    defaultValues: {
      category: '',
      description: '',
    },
  });

  useEffect(() => {
    if (selectedTicket) {
      form.setValue('category', selectedTicket.category);
      form.setValue('description', selectedTicket.description);
    } else {
      form.reset();
    }
  }, [selectedTicket, isOpen, form]);

  const handleSubmit = ({ category, description }: Ticket) => {
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

    closeModal();

    if (!isEditMode) {
      form.reset();
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
              {selectedTicket.scheduled_time && (
                <div className='space-y-1'>
                  <label className='text-xs font-medium text-muted-foreground'>
                    Data Agendada
                  </label>

                  <div className='flex items-center gap-1.5 text-sm'>
                    <Clock className='h-4 w-4 text-muted-foreground' />

                    <span>
                      {new Date(
                        selectedTicket.scheduled_time,
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

        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          <FormProvider {...form}>
            <div className='space-y-2'>
              <label
                htmlFor='category'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Categoria
              </label>

              <select
                {...form.register('category')}
                required
                disabled={isEditMode}
                className='flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
              >
                <option value=''>Selecione uma categoria</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='description'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Descrição
              </label>
              <textarea
                {...form.register('description')}
                required
                rows={4}
                placeholder='Descreva o problema ou necessidade...'
                className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
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
