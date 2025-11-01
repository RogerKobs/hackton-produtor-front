export const CATEGORY_OPTIONS = [
  { label: 'Assistência Técnica', value: 'technical' },
  { label: 'Consultoria Financeira', value: 'financial' },
  { label: 'Assessoria Jurídica', value: 'legal' },
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
