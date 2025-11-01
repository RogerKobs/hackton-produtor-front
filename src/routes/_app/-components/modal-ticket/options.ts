export const CATEGORY_OPTIONS = [
  { label: 'Assistência Veterinária', value: 'technical' },
  { label: 'Assistência Agronômica', value: 'financial' },
  { label: 'Assistência de Infraestrutura', value: 'legal' },
  { label: 'Capacitação', value: 'training' },
  { label: 'Outros', value: 'other' },
];

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  scheduled: 'Agendado',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

export const STATUS_VARIANTS: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  scheduled: 'default',
  in_progress: 'default',
  completed: 'outline',
  cancelled: 'destructive',
};

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-[#eb7b24] text-white border-transparent',
  scheduled: 'bg-[#3b82f6] text-white border-transparent',
  in_progress: 'bg-[#6366f1] text-white border-transparent',
  completed: 'bg-[#008f35] text-white border-transparent',
  cancelled: 'bg-[#000000] text-white border-transparent',
};
