import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, UserCircle } from 'lucide-react';
import { useTicketModalStore, type Ticket } from '@/stores/ticket-modal-store';

const CATEGORY_LABELS: Record<string, string> = {
  technical: 'Assistência Técnica',
  financial: 'Consultoria Financeira',
  legal: 'Assessoria Jurídica',
  training: 'Capacitação',
  other: 'Outros',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  scheduled: 'Agendado',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

const STATUS_VARIANTS: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  scheduled: 'default',
  in_progress: 'default',
  completed: 'outline',
  cancelled: 'destructive',
};

type CardTicketProps = Ticket;

export function CardTicket({
  id,
  category,
  created_at,
  status,
  description,
  scheduled_time,
  technician_name,
}: CardTicketProps) {
  const { openModal } = useTicketModalStore();

  const handleClick = () => {
    openModal({
      id,
      category,
      created_at,
      status,
      description,
      scheduled_time,
      technician_name,
    });
  };

  return (
    <Card
      className='flex flex-col cursor-pointer transition-shadow hover:shadow-md'
      onClick={handleClick}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-2 mb-2'>
          <Badge
            variant={STATUS_VARIANTS[status] || 'default'}
            className='text-xs'
          >
            {STATUS_LABELS[status] || status}
          </Badge>
          <span className='text-xs text-muted-foreground'>
            {new Date(created_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
            })}
          </span>
        </div>
        <CardTitle className='text-base leading-tight'>
          {CATEGORY_LABELS[category] || category}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-1 space-y-3 pt-0'>
        <p className='text-sm text-muted-foreground line-clamp-2'>
          {description}
        </p>
        <div className='space-y-1.5 text-xs'>
          {scheduled_time && (
            <div className='flex items-center gap-1.5 text-muted-foreground'>
              <Calendar className='h-3.5 w-3.5' />
              <span>{new Date(scheduled_time).toLocaleString('pt-BR')}</span>
            </div>
          )}
          {technician_name && (
            <div className='flex items-center gap-1.5 text-muted-foreground'>
              <UserCircle className='h-3.5 w-3.5' />
              <span>{technician_name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
