import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, UserCircle } from 'lucide-react';
import { useTicketModalStore } from '@/stores/ticket-modal-store';

const CATEGORY_LABELS: Record<string, string> = {
  technical: 'Assistência Veterinária',
  financial: 'Assistência Agronômica',
  legal: 'Assistência de Infraestrutura',
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

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#eb7b24', text: '#ffffff' },
  scheduled: { bg: '#008f35', text: '#ffffff' },
  in_progress: { bg: '#eb7b24', text: '#ffffff' },
  completed: { bg: '#008f35', text: '#ffffff' },
  cancelled: { bg: '#000000', text: '#ffffff' },
};

interface CardTicketProps {
  id: number;
  title: string;
  category: string;
  created_at: string;
  status: string;
  description: string;
  scheduling_at: string;
  technician_name: string;
  id_producers: string;
}

export function CardTicket({
  id,
  title,
  category,
  created_at,
  status,
  description,
  scheduling_at,
  technician_name,
  id_producers,
}: CardTicketProps) {
  const { openModal } = useTicketModalStore();

  const handleClick = () => {
    openModal({
      id,
      title,
      category,
      created_at,
      status,
      description,
      scheduling_at,
      technician_name,
      id_producers,
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
            className='text-xs border-transparent'
            style={{
              backgroundColor: STATUS_COLORS[status]?.bg || '#008f35',
              color: STATUS_COLORS[status]?.text || '#ffffff',
            }}
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

        <CardTitle className='text-base leading-tight flex items-center gap-2'>
          {title}
          <Badge variant='outline' className='text-xs'>
            {CATEGORY_LABELS[category] || category}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className='flex-1 space-y-3 pt-0'>
        <p className='text-sm text-muted-foreground line-clamp-2'>
          {description}
        </p>
        <div className='space-y-1.5 text-xs'>
          {scheduling_at && (
            <div className='flex items-center gap-1.5 text-muted-foreground'>
              <Calendar className='h-3.5 w-3.5' />
              <span>{new Date(scheduling_at).toLocaleString('pt-BR')}</span>
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
